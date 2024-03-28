import { LoaderFunction } from '@remix-run/node'
import { sessionRepository } from '~/.server/infrastructure/adapter/auth'

export const orderLoader: LoaderFunction = async ({ request }) => {
  return sessionRepository.verifySession(request)
}
