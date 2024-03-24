import { createCookieSessionStorage, redirect } from '@remix-run/node'
import dotenv from 'dotenv'
import { generateSessionToken } from './firebase.server'

dotenv.config()

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set!')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
})
const getSession = async (request: Request) =>
  storage.getSession(request.headers.get('Cookie'))

export async function createUserSession(
  email: string,
  idToken: string,
  redirectTo: string
) {
  const session = await storage.getSession()

  session.set('token', await generateSessionToken(idToken))
  session.set('userEmail', email.toLowerCase())

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

// async function getUserSessionEmail(request: Request) {
//   const cookieSession = await getSession(request)
//   const userEmail = cookieSession.get('userEmail')

//   if (!userEmail) return null
//   return userEmail.toLowerCase()
// }

// async function getUserSession(request: Request) {
//   const cookieSession = await getSession(request)
//   const token = cookieSession.get('token')
//   if (!token) return null

//   try {
//     const tokenUser = await adminAuth.verifySessionCookie(token, true)
//     return tokenUser
//   } catch (error) {
//     return null
//   }
// }

// async function destroySession(request: Request) {
//   const session = await getSession(request)

//   return redirect('/login', {
//     headers: { 'Set-Cookie': await storage.destroySession(session) },
//   })
// }

// async function signOut(request: Request) {
//   await signOutFirebase()
//   return await destroySession(request)
// }

// export { createUserSession, signOut, getUserSession, getUserSessionEmail }
