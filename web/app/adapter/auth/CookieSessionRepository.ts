import { createCookieSessionStorage, json, redirect } from '@remix-run/node'
import dotenv from 'dotenv'
import { Auth } from 'firebase-admin/auth'
import { TWO_WEEKS } from '~/constants'
import { ISessionRepository } from '~/domain/ports/SessionRepository'
import { getUser } from '~/firebase.server'
import { CallbackData, ResponseData, User } from '~/type'
import { userRepository } from '../user'

export function CookieSessionRepository(auth: Auth): ISessionRepository {
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

  const generateSessionToken = async (idToken: string) => {
    const decodedToken = await auth.verifyIdToken(idToken)

    if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
      throw new Error('Recent sign in required')
    }

    return await auth.createSessionCookie(idToken, { expiresIn: TWO_WEEKS })
  }
  const verifySessionToken = (token: string) => {
    return auth.verifySessionCookie(token, true)
  }

  async function createUserSession(idToken: string, redirectTo: string) {
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
  async function verifySession(
    request: Request,
    callback?: (user: User) => Promise<CallbackData>
  ) {
    const cookieSession = await getSession(request)
    const token = cookieSession.get('token')

    if (!token) return redirect('/login')

    try {
      const decodedToken = await verifySessionToken(token)
      const user = await userRepository.getUser(decodedToken.email || '')
      let responseData: ResponseData = { user }
      let status = null

      // if a callback function is provided, call it and include its data in the responseData
      if (callback) {
        const { status: cbStatus, ...rest } = await callback(user)

        status = cbStatus
        responseData = { ...responseData, ...rest }
      }

      if (status) {
        return json(responseData, { status })
      }

      return json(responseData)
    } catch (error) {
      console.log('Error getting user from token: ', error)

      return redirect('/logout')
    }
  }

  async function destroyUserSession(request: Request) {
    const session = await getSession(request)

    return redirect('/login', {
      headers: {
        'Set-Cookie': await storage.destroySession(session),
      },
    })
  }

  return {
    createUserSession,
    verifySession,
    destroyUserSession,
  }
}
