import { auth } from '~/.server/infrastructure/firebase'
import { CookieSessionRepository } from './CookieSessionRepository'

const sessionRepository = CookieSessionRepository(auth)

export { sessionRepository }
