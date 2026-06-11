import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Payload body parsers (large size for Base64 image transfers)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Database files structure
  const dataDir = path.join(process.cwd(), "src", "data");
  const activePath = path.join(dataDir, "portfolio-active.json");
  const defaultPath = path.join(dataDir, "portfolio-default.json");
  const messagesPath = path.join(dataDir, "messages-active.json");

  // Ensure directories exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // --- API Routes ---

  // 1. Get Portfolio Data
  app.get("/api/portfolio", (req, res) => {
    try {
      if (fs.existsSync(activePath)) {
        const data = fs.readFileSync(activePath, "utf8");
        return res.json(JSON.parse(data));
      } else if (fs.existsSync(defaultPath)) {
        const data = fs.readFileSync(defaultPath, "utf8");
        return res.json(JSON.parse(data));
      } else {
        return res.status(404).json({ error: "Default portfolio data not found" });
      }
    } catch (error) {
      console.error("Error loading portfolio data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // 2. Save/Update Portfolio Data
  app.post("/api/portfolio", (req, res) => {
    try {
      const data = req.body;
      fs.writeFileSync(activePath, JSON.stringify(data, null, 2), "utf8");
      return res.json({ success: true, message: "Portfolio updated successfully" });
    } catch (error) {
      console.error("Error saving portfolio data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // 3. Get Contact Messages
  app.get("/api/messages", (req, res) => {
    try {
      if (fs.existsSync(messagesPath)) {
        const data = fs.readFileSync(messagesPath, "utf8");
        return res.json(JSON.parse(data));
      } else {
        return res.json([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // 4. Save/Post Contact Message
  app.post("/api/messages", (req, res) => {
    try {
      const { senderName, senderEmail, subject, content } = req.body;
      if (!senderName || !senderEmail || !content) {
        return res.status(400).json({ error: "Please fill out all required fields" });
      }

      let messages: any[] = [];
      if (fs.existsSync(messagesPath)) {
        const data = fs.readFileSync(messagesPath, "utf8");
        try {
          messages = JSON.parse(data);
        } catch (e) {
          messages = [];
        }
      }

      const newMessage = {
        id: "msg_" + Date.now().toString() + "_" + Math.random().toString(36).substr(2, 5),
        senderName,
        senderEmail,
        subject: subject || "بدون موضوع",
        content,
        timestamp: new Date().toISOString()
      };

      messages.unshift(newMessage);
      fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), "utf8");
      return res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error adding message:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // 5. Delete Contact Message
  app.delete("/api/messages/:id", (req, res) => {
    try {
      const { id } = req.params;
      if (fs.existsSync(messagesPath)) {
        const data = fs.readFileSync(messagesPath, "utf8");
        let messages = JSON.parse(data);
        messages = messages.filter((msg: any) => msg.id !== id);
        fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), "utf8");
        return res.json({ success: true, message: "Message deleted successfully" });
      }
      return res.status(404).json({ error: "No messages database found" });
    } catch (error) {
      console.error("Error deleting message:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // --- Vite & Production Client Static Serving ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Portfolio running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
