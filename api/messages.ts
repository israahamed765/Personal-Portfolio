import { listDocuments, setDocument } from "../lib/firestore";

type Req = {
  method?: string;
  body?: unknown;
};

type Res = {
  status: (code: number) => Res;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type Message = {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  timestamp: string;
};

export const config = { maxDuration: 30 };

function sortByTimestamp(messages: Message[]) {
  return messages.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store");

  try {
    if (req.method === "GET") {
      const messages = await listDocuments<Message>("messages");
      return res.status(200).json(sortByTimestamp(messages));
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
      const { senderName, senderEmail, subject, content } = body as Record<string, string>;

      if (!senderName || !senderEmail || !content) {
        return res.status(400).json({ error: "Please fill out all required fields" });
      }

      const id = "msg_" + Date.now().toString() + "_" + Math.random().toString(36).substr(2, 5);
      const newMessage: Message = {
        id,
        senderName,
        senderEmail,
        subject: subject || "بدون موضوع",
        content,
        timestamp: new Date().toISOString(),
      };

      await setDocument(`messages/${id}`, newMessage);
      return res.status(200).json({ success: true, message: "Message sent successfully" });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("[api/messages]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
