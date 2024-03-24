import {
  initializeApp,
  getApps,
  getApp,
  applicationDefault,
} from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import type { App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let app: App

if (getApps().length === 0) {
  console.log('server initializing firebase app')
  app = initializeApp({
    credential: applicationDefault(),
    databaseURL:
      'https://acfirst-ordering-default-rtdb.asia-southeast1.firebasedatabase.app',
  })
} else {
  console.log('server reusing firebase app')
  app = getApp()
}

const auth = getAuth(app)
const db = getFirestore(app)

export async function generateSessionToken(idToken: string) {
  const decodedToken = await auth.verifyIdToken(idToken)

  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error('Recent sign in required')
  }

  const twoWeeks = 60 * 60 * 24 * 14 * 1000

  return await auth.createSessionCookie(idToken, { expiresIn: twoWeeks })
}

export { auth, db }
