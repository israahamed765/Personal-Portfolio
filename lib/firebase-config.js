const defaults = {
  projectId: "composite-armor-7wx5p",
  apiKey: "AIzaSyBdoUiGsLsz7w1uXjWQuur9FKMc8SuIFXg",
  firestoreDatabaseId: "ai-studio-b74b5ce6-173e-49e4-8655-7c1745909133",
};

export function getFirebaseConfig() {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_FIRESTORE_DATABASE_ID) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      apiKey: process.env.FIREBASE_API_KEY || defaults.apiKey,
      firestoreDatabaseId: process.env.FIREBASE_FIRESTORE_DATABASE_ID,
    };
  }

  return { ...defaults };
}
