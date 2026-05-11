// src/firebase/config.js
//
// Firebase config reads from environment variables.
// Copy .env.example → .env and fill in your values.
// Vite exposes only VITE_* prefixed vars to the browser bundle.

import { initializeApp, getApps } from 'firebase/app'
import { getFirestore }           from 'firebase/firestore'
import { getAuth }                from 'firebase/auth'

// Validate required env vars at startup (dev only — fast feedback)
if (import.meta.env.DEV) {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
  ]
  for (const key of required) {
    if (!import.meta.env[key] || import.meta.env[key].startsWith('your_')) {
      console.warn(`⚠️  Firebase: ${key} is not set in .env`)
    }
  }
}

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Prevent duplicate app initialization (hot-reload safe)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0]

export const db   = getFirestore(app)
export const auth = getAuth(app)
// Note: getStorage removed — not used in this project (saves ~15KB)
export default app