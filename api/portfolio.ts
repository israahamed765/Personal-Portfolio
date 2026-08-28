import { getDocument, setDocument } from "../lib/firestore";

type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export const config = { maxDuration: 30 };

export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.method === "GET") {
      const data = await getDocument("portfolio/active");
      if (!data) {
        return res.status(404).json({ error: "Portfolio data not found" });
      }
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      const data = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!data || typeof data !== "object") {
        return res.status(400).json({ error: "Invalid portfolio payload" });
      }
      await setDocument("portfolio/active", data as Record<string, unknown>);
      return res.status(200).json({ success: true, message: "Portfolio updated successfully" });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("[api/portfolio]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
