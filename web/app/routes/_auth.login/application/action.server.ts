import type { ActionFunction } from '@remix-run/node'
import { sessionService } from '~/.server/services/SessionService'

export const loginAction: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const idToken = form.get('idToken')?.toString() || ''

  return sessionService.createUserSession(idToken, '/')
}
