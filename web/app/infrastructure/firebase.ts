import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import {
  App,
  applicationDefault,
  getApp,
  getApps,
  initializeApp,
} from 'firebase-admin/app'

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

export { auth, db }
