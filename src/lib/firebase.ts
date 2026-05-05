
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Yapılandırma eksikse uygulamayı çökertmek yerine null döndüren bir yapı kuralım
let app: FirebaseApp | undefined;
let auth: Auth | any; // Tip güvenliği için 'any' veya null kontrolü

try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  } else {
    console.warn("Firebase API Key eksik. Lütfen ortam değişkenlerini kontrol edin.");
  }
} catch (error) {
  console.error("Firebase başlatılırken hata oluştu:", error);
}

export { auth, app };
