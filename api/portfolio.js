import { getDocument, setDocument } from "../lib/firestore.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

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
      await setDocument("portfolio/active", data);
      return res.status(200).json({ success: true, message: "Portfolio updated successfully" });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("[api/portfolio]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
