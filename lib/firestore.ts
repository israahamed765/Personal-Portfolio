import { getFirebaseConfig } from "./firebase-config";

type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { timestampValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

function documentsRoot(): string {
  const { projectId, firestoreDatabaseId } = getFirebaseConfig();
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents`;
}

function documentsUrl(docPath: string): string {
  const { apiKey } = getFirebaseConfig();
  const encodedPath = docPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${documentsRoot()}/${encodedPath}?key=${apiKey}`;
}

function encodeValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === "boolean") {
    return { booleanValue: value };
  }
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeValue) } };
  }
  if (typeof value === "object") {
    const fields: Record<string, FirestoreValue> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (nested !== undefined) {
        fields[key] = encodeValue(nested);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function decodeValue(value: FirestoreValue | undefined): unknown {
  if (!value) return null;
  if ("nullValue" in value) return null;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("stringValue" in value) return value.stringValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) {
    return (value.arrayValue.values || []).map((item) => decodeValue(item));
  }
  if ("mapValue" in value) {
    return decodeFields(value.mapValue.fields || {});
  }
  return null;
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    data[key] = decodeValue(value);
  }
  return data;
}

function toDocumentFields(data: Record<string, unknown>): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields[key] = encodeValue(value);
    }
  }
  return fields;
}

async function readJson(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: { message: text || "Invalid JSON from Firestore" } };
  }
}

export async function getDocument<T>(docPath: string): Promise<T | null> {
  const res = await fetch(documentsUrl(docPath), { method: "GET" });
  const json = await readJson(res);

  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(json?.error?.message || `Firestore GET failed (${res.status})`);
  }
  if (!json.fields) {
    return null;
  }
  return decodeFields(json.fields) as T;
}

export async function setDocument(docPath: string, data: Record<string, unknown>): Promise<void> {
  const fieldNames = Object.keys(data).filter((key) => data[key] !== undefined);
  const mask = fieldNames.map((name) => `updateMask.fieldPaths=${encodeURIComponent(name)}`).join("&");
  const url = `${documentsUrl(docPath)}${mask ? `&${mask}` : ""}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: toDocumentFields(data) }),
  });
  const json = await readJson(res);
  if (!res.ok) {
    throw new Error(json?.error?.message || `Firestore PATCH failed (${res.status})`);
  }
}

export async function listDocuments<T>(collectionPath: string): Promise<Array<T & { id: string }>> {
  const { apiKey } = getFirebaseConfig();
  const collectionId = collectionPath.split("/").pop() || collectionPath;
  const res = await fetch(`${documentsRoot()}:runQuery?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        limit: 100,
      },
    }),
  });
  const json = await readJson(res);

  if (!res.ok) {
    throw new Error(json?.error?.message || `Firestore QUERY failed (${res.status})`);
  }

  const rows = Array.isArray(json) ? json : [];
  return rows
    .filter((row: { document?: { name?: string; fields?: Record<string, FirestoreValue> } }) => row.document?.fields)
    .map((row: { document: { name?: string; fields?: Record<string, FirestoreValue> } }) => {
      const id = (row.document.name || "").split("/").pop() || "";
      const fields = decodeFields(row.document.fields || {});
      return { ...(fields as T), id };
    });
}

export async function deleteDocument(docPath: string): Promise<void> {
  const res = await fetch(documentsUrl(docPath), { method: "DELETE" });
  if (res.status === 404) {
    return;
  }
  const json = await readJson(res);
  if (!res.ok) {
    throw new Error(json?.error?.message || `Firestore DELETE failed (${res.status})`);
  }
}
