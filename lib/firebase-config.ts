type FirebaseClientConfig = {
  projectId: string;
  apiKey: string;
  firestoreDatabaseId: string;
};

const defaults: FirebaseClientConfig = {
  projectId: "composite-armor-7wx5p",
  apiKey: "AIzaSyBdoUiGsLsz7w1uXjWQuur9FKMc8SuIFXg",
  firestoreDatabaseId: "ai-studio-b74b5ce6-173e-49e4-8655-7c1745909133",
};

export function getFirebaseConfig(): FirebaseClientConfig {
  // Only override the bundled AI Studio database when BOTH project and database id are set.
  // A project id alone would silently read the empty "(default)" Firestore database on Vercel.
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_FIRESTORE_DATABASE_ID) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      apiKey: process.env.FIREBASE_API_KEY || defaults.apiKey,
      firestoreDatabaseId: process.env.FIREBASE_FIRESTORE_DATABASE_ID,
    };
  }

  return { ...defaults };
}

