import {
  initializeApp,
  getApps,
  getApp,
  applicationDefault,
} from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import type { App } from 'firebase-admin/app'
import { Timestamp, getFirestore } from 'firebase-admin/firestore'
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

// Auth
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

// Firestore
interface CreateUserPayload {
  username: string
  email: string
  company: string
  userId: string
}

// Users
export async function createUser(docId: string, payload: CreateUserPayload) {
  try {
    await db.collection('users').doc(docId).set(payload)
  } catch (error) {
    console.log('Caught error creating user document: ', error)

    // need to delete user, else the user cant sign up again
    await auth.deleteUser(payload.userId)
    throw new Error('Handled error creating user document')
  }
}

export async function getUser(email: string) {
  const docSnapshot = await db
    .collection('users')
    .doc(email.toLowerCase())
    .get()

  if (!docSnapshot.exists) {
    throw new Error('User does not exist')
  }

  return docSnapshot.data()
}

// Stocks
interface Stock {
  itemCode: string
  location: string
  batch: string
  quantity: number
  pricePerUnit: number
  updatedAt: Timestamp
}

export async function getStocks() {
  const querySnapshot = await db.collection('stocks').get()

  const data: Stock[] = []

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as Stock

    data.push({ ...docData })
  })

  return data
}
