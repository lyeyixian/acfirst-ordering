import { initializeApp } from 'firebase/app'
import {
  getAuth,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: window.ENV.API_KEY,
  authDomain: window.ENV.AUTH_DOMAIN,
  databaseURL: window.ENV.DATABASE_URL,
  projectId: window.ENV.PROJECT_ID,
  storageBucket: window.ENV.STORAGE_BUCKET,
  messagingSenderId: window.ENV.MESSAGING_SENDER_ID,
  appId: window.ENV.APP_ID,
  measurementId: window.ENV.MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Let Remix handle the persistence via session cookies.
setPersistence(auth, inMemoryPersistence)

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}
