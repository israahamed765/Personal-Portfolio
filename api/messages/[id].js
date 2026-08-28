import { deleteDocument } from "../../lib/firestore.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  try {
    if (req.method !== "DELETE") {
      res.setHeader("Allow", "DELETE");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    if (!id) {
      return res.status(400).json({ error: "Message id is required" });
    }

    await deleteDocument(`messages/${id}`);
    return res.status(200).json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error("[api/messages/:id]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
