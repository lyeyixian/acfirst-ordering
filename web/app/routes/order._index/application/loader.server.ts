import { LoaderFunction } from '@remix-run/node'
import { sessionRepository } from '~/adapter/auth'

export const orderLoader: LoaderFunction = async ({ request }) => {
  return sessionRepository.verifySession(request)
}
