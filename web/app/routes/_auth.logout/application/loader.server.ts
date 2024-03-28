import { LoaderFunction } from '@remix-run/node'
import { sessionRepository } from '~/.server/infrastructure/adapter/auth'

export const logoutLoader: LoaderFunction = async ({ request }) =>
  sessionRepository.destroyUserSession(request)
