import { getFirebaseConfig } from "./firebase-config.js";

function documentsRoot() {
  const { projectId, firestoreDatabaseId } = getFirebaseConfig();
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents`;
}

function documentsUrl(docPath) {
  const { apiKey } = getFirebaseConfig();
  const encodedPath = docPath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${documentsRoot()}/${encodedPath}?key=${apiKey}`;
}

function encodeValue(value) {
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
    const fields = {};
    for (const [key, nested] of Object.entries(value)) {
      if (nested !== undefined) {
        fields[key] = encodeValue(nested);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function decodeValue(value) {
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

function decodeFields(fields) {
  const data = {};
  for (const [key, value] of Object.entries(fields)) {
    data[key] = decodeValue(value);
  }
  return data;
}

function toDocumentFields(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields[key] = encodeValue(value);
    }
  }
  return fields;
}

async function readJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { error: { message: text || "Invalid JSON from Firestore" } };
  }
}

export async function getDocument(docPath) {
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
  return decodeFields(json.fields);
}

export async function setDocument(docPath, data) {
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

export async function listDocuments(collectionPath) {
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
    .filter((row) => row.document?.fields)
    .map((row) => {
      const id = (row.document.name || "").split("/").pop() || "";
      const fields = decodeFields(row.document.fields || {});
      return { ...fields, id };
    });
}

export async function deleteDocument(docPath) {
  const res = await fetch(documentsUrl(docPath), { method: "DELETE" });
  if (res.status === 404) {
    return;
  }
  const json = await readJson(res);
  if (!res.ok) {
    throw new Error(json?.error?.message || `Firestore DELETE failed (${res.status})`);
  }
}
