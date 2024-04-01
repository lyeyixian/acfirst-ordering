import { LoaderFunction } from '@remix-run/node'
import { sessionService } from '~/.server/services/SessionService'

export const orderLoader: LoaderFunction = async ({ request }) => {
  return sessionService.verifySession(request)
}
