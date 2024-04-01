import { LoaderFunction } from '@remix-run/node'
import { sessionService } from '~/.server/application/SessionService'

export const orderLoader: LoaderFunction = async ({ request }) => {
  return sessionService.verifySession(request)
}
