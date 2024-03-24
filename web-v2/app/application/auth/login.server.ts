import type { ActionFunction, ActionFunctionArgs } from '@remix-run/node'
// import { createUserSession } from '~/session.server'

export const loginAction: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const form = await request.formData()
  const idToken = form.get('idToken')?.toString() || ''
  const email = form.get('email')?.toString() || ''

  return { status: 200, json: { idToken, email } }
  // return createUserSession(email, idToken, '/')
}
