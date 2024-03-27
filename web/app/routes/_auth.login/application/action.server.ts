import type { ActionFunction } from '@remix-run/node'
import { createUserSession } from '~/session.server'

export const loginAction: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const idToken = form.get('idToken')?.toString() || ''

  return createUserSession(idToken, '/')
}
