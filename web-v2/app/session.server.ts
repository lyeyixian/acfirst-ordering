import { createCookieSessionStorage, json, redirect } from '@remix-run/node'
import dotenv from 'dotenv'
import {
  generateSessionToken,
  getUser,
  verifySessionToken,
} from './firebase.server'
import { TWO_WEEKS } from './constants'

dotenv.config()

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set!')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: '__acfirst_ordering_session',
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: TWO_WEEKS,
    httpOnly: true,
  },
})
const getSession = async (request: Request) =>
  storage.getSession(request.headers.get('Cookie'))

export async function createUserSession(idToken: string, redirectTo: string) {
  const session = await storage.getSession()

  session.set('token', await generateSessionToken(idToken))

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

/**
 * Verifies the session by checking if the token exists and is valid.
 * If the token is valid, it returns the user profile along with any additional data provided by the callback function.
 * If the token is invalid, it redirects the user to the login page or logs them out.
 * @param request - The request object.
 * @param callback - An optional callback function that can provide additional data to be included in the response.
 * @returns A remix response containing the user profile and any additional data.
 */
export async function verifySession(
  request: Request,
  callback?: () => {
    [target: string]: unknown
  }
) {
  const cookieSession = await getSession(request)
  const token = cookieSession.get('token')

  if (!token) return redirect('/login')

  try {
    const decodedToken = await verifySessionToken(token)
    let data = { user: await getUser(decodedToken.email || '') }

    if (callback) {
      const callbackData = callback()

      if (Object.keys(callbackData).length !== 0) {
        data = { ...data, ...callbackData }
      }
    }

    return json(data)
  } catch (error) {
    console.log('Error getting user from token: ', error)

    return redirect('/logout')
  }
}

export async function destroyUserSession(request: Request) {
  const session = await getSession(request)

  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}
