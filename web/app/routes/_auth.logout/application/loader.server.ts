import { LoaderFunction } from '@remix-run/node'
import { destroyUserSession } from '~/session.server'

export const logoutLoader: LoaderFunction = async ({ request }) =>
  destroyUserSession(request)
