import type { ActionFunction } from '@remix-run/node'
import { sessionRepository } from '~/infrastructure/adapter/auth'

export const loginAction: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const idToken = form.get('idToken')?.toString() || ''

  return sessionRepository.createUserSession(idToken, '/')
}
