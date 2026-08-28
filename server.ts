import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { deleteDocument, getDocument, listDocuments, setDocument } from "./lib/firestore";

function handleFirestoreError(error: unknown, operationType: string, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  console.error("Firestore Error logged for diagnostics:", JSON.stringify({
    error: errMsg,
    operationType,
    path,
  }));
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

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
  app.get("/api/portfolio", async (req, res) => {
    try {
      let localData: any = null;
      if (fs.existsSync(activePath)) {
        try {
          localData = JSON.parse(fs.readFileSync(activePath, "utf8"));
        } catch (e) {
          console.error("Error reading local active data:", e);
        }
      } else if (fs.existsSync(defaultPath)) {
        try {
          localData = JSON.parse(fs.readFileSync(defaultPath, "utf8"));
        } catch (e) {
          console.error("Error reading default data:", e);
        }
      }

      try {
        const firestoreData: any = await getDocument("portfolio/active");
        if (firestoreData) {
          if (localData && localData.personalInfo && localData.personalInfo.avatarUrl &&
              (!firestoreData.personalInfo || !firestoreData.personalInfo.avatarUrl)) {
            if (!firestoreData.personalInfo) {
              firestoreData.personalInfo = {};
            }
            firestoreData.personalInfo.avatarUrl = localData.personalInfo.avatarUrl;
            await setDocument("portfolio/active", firestoreData);
            console.log("[Firebase] Successfully merged and uploaded local avatar copy to Firestore active document.");
          }

          return res.json(firestoreData);
        }
      } catch (dbErr) {
        handleFirestoreError(dbErr, "get", "portfolio/active");
        console.warn("[Firebase] Firestore load failed, using cache fallback:", dbErr);
      }

      if (localData) {
        try {
          await setDocument("portfolio/active", localData);
          console.log("[Firebase] Cache bootstrapped into Firestore from local backup.");
        } catch (e) {
          handleFirestoreError(e, "write", "portfolio/active");
        }
        return res.json(localData);
      } else {
        return res.status(404).json({ error: "Portfolio data not found" });
      }
    } catch (error) {
      console.error("Error loading portfolio data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // 2. Save/Update Portfolio Data
  app.post("/api/portfolio", async (req, res) => {
    try {
      const data = req.body;

      // 1. Always save locally as a backup
      fs.writeFileSync(activePath, JSON.stringify(data, null, 2), "utf8");

      try {
        await setDocument("portfolio/active", data);
        console.log("[Firebase] Successfully saved update to Firestore!");
      } catch (dbErr) {
        handleFirestoreError(dbErr, "write", "portfolio/active");
        console.error("[Firebase] Firestore save failed:", dbErr);
      }

      return res.json({ success: true, message: "Portfolio updated successfully" });
    } catch (error) {
      console.error("Error saving portfolio data:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // 3. Get Contact Messages
  app.get("/api/messages", async (req, res) => {
    try {
      try {
        const messages = await listDocuments<any>("messages");
        messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return res.json(messages);
      } catch (dbErr) {
        handleFirestoreError(dbErr, "list", "messages");
        console.warn("[Firebase] Firestore messages fetch failed, falling back:", dbErr);
      }

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
  app.post("/api/messages", async (req, res) => {
    try {
      const { senderName, senderEmail, subject, content } = req.body;
      if (!senderName || !senderEmail || !content) {
        return res.status(400).json({ error: "Please fill out all required fields" });
      }

      const mId = "msg_" + Date.now().toString() + "_" + Math.random().toString(36).substr(2, 5);
      const newMessage = {
        id: mId,
        senderName,
        senderEmail,
        subject: subject || "بدون موضوع",
        content,
        timestamp: new Date().toISOString()
      };

      try {
        await setDocument("messages/" + mId, newMessage);
      } catch (dbErr) {
        handleFirestoreError(dbErr, "write", "messages/" + mId);
        console.error("[Firebase] Firestore message save failed:", dbErr);
      }

      // 2. Submit to local sync list
      let messages: any[] = [];
      if (fs.existsSync(messagesPath)) {
        try {
          const raw = fs.readFileSync(messagesPath, "utf8");
          messages = JSON.parse(raw);
        } catch (e) {
          messages = [];
        }
      }
      messages.unshift(newMessage);
      fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), "utf8");

      return res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error adding message:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // 5. Delete Contact Message
  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;

      try {
        await deleteDocument("messages/" + id);
      } catch (dbErr) {
        handleFirestoreError(dbErr, "delete", "messages/" + id);
        console.error("[Firebase] Firestore message delete failed:", dbErr);
      }

      // 2. Terminate from local backup
      if (fs.existsSync(messagesPath)) {
        const data = fs.readFileSync(messagesPath, "utf8");
        let messages = JSON.parse(data);
        messages = messages.filter((msg: any) => msg.id !== id);
        fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2), "utf8");
      }

      return res.json({ success: true, message: "Message deleted successfully" });
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
