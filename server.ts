import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

// --- Conforming Error Handling definitions for platform diagnostics ---
enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  
  console.error("Firestore Error logged for diagnostics:", JSON.stringify(errInfo));
  return errInfo;
}

// Read Firebase config safely at runtime (supports both file and environment fallbacks)
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
let db: any = null;

try {
  let firebaseConfig: any = null;
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } else if (process.env.FIREBASE_PROJECT_ID) {
    firebaseConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      appId: process.env.FIREBASE_APP_ID,
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firestoreDatabaseId: process.env.FIREBASE_FIRESTORE_DATABASE_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
    };
  }

  if (firebaseConfig) {
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    console.log("[Firebase] Firestore client initialized successfully!");
  } else {
    console.warn("[Firebase] Firebase config missing (both file and Env vars). Running in local file-system fallback mode.");
  }
} catch (err) {
  console.error("[Firebase] Initialization error:", err);
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

      if (db) {
        try {
          const docRef = doc(db, "portfolio", "active");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            let firestoreData = docSnap.data();

            // Self-healing merge: If we have an avatarUrl locally but empty or missing in Firestore, update Firestore!
            if (localData && localData.personalInfo && localData.personalInfo.avatarUrl &&
                (!firestoreData.personalInfo || !firestoreData.personalInfo.avatarUrl)) {
              if (!firestoreData.personalInfo) {
                firestoreData.personalInfo = {};
              }
              firestoreData.personalInfo.avatarUrl = localData.personalInfo.avatarUrl;
              
              // Push merged state back to Firestore
              await setDoc(docRef, firestoreData);
              console.log("[Firebase] Successfully merged and uploaded local avatar copy to Firestore active document.");
            }

            return res.json(firestoreData);
          }
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.GET, "portfolio/active");
          console.warn("[Firebase] Firestore load failed, using cache fallback:", dbErr);
        }
      }

      if (localData) {
        if (db) {
          try {
            await setDoc(doc(db, "portfolio", "active"), localData);
            console.log("[Firebase] Cache bootstrapped into Firestore from local backup.");
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, "portfolio/active");
          }
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

      // 2. Transmit to global persistent Firestore
      if (db) {
        try {
          await setDoc(doc(db, "portfolio", "active"), data);
          console.log("[Firebase] Successfully saved update to Firestore!");
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, "portfolio/active");
          console.error("[Firebase] Firestore save failed:", dbErr);
        }
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
      if (db) {
        try {
          const querySnapshot = await getDocs(collection(db, "messages"));
          const messages: any[] = [];
          querySnapshot.forEach((docSnap) => {
            messages.push({ ...docSnap.data(), id: docSnap.id });
          });
          // Sort descendingly by date
          messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          return res.json(messages);
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.LIST, "messages");
          console.warn("[Firebase] Firestore messages fetch failed, falling back:", dbErr);
        }
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

      // 1. Submit to Firestore
      if (db) {
        try {
          await setDoc(doc(db, "messages", mId), newMessage);
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, "messages/" + mId);
          console.error("[Firebase] Firestore message save failed:", dbErr);
        }
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

      // 1. Terminate from Firestore
      if (db) {
        try {
          await deleteDoc(doc(db, "messages", id));
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.DELETE, "messages/" + id);
          console.error("[Firebase] Firestore message delete failed:", dbErr);
        }
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
       console.log(`[Server] Portfolio running on port ${PORT}`);
   });
}

startServer();
