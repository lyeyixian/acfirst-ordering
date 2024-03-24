import {
  initializeApp,
  getApps,
  getApp,
  applicationDefault,
} from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import type { App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { TWO_WEEKS } from './constants'

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

  return await auth.createSessionCookie(idToken, { expiresIn: TWO_WEEKS })
}

export function verifySessionToken(token: string) {
  return auth.verifySessionCookie(token, true)
}

export { auth, db }
