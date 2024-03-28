import { auth } from '~/infrastructure/firebase'
import { CookieSessionRepository } from './CookieSessionRepository'

const sessionRepository = CookieSessionRepository(auth)

export { sessionRepository }
