import { LoaderFunction } from '@remix-run/node'
import { sessionService } from '~/.server/application/SessionService'

export const logoutLoader: LoaderFunction = async ({ request }) =>
  sessionService.destroyUserSession(request)
