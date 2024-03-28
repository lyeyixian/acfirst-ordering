import { json, type ActionFunction } from '@remix-run/node'
import { sessionRepository } from '~/infrastructure/adapter/auth'
import { userRepository } from '~/infrastructure/adapter/user'

export const signUpAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const email = formData.get('email')?.toString() || ''
  const uid = formData.get('uid')?.toString() || ''
  const company = formData.get('company')?.toString() || ''
  const username = formData.get('username')?.toString() || ''

  try {
    await userRepository.createUser(email, {
      email,
      company,
      username,
      userId: uid,
    })
  } catch (error) {
    console.log(error)

    return json(
      { error: 'Error creating user. Please try again' },
      { status: 500 }
    )
  }

  const idToken = formData.get('idToken')?.toString() || ''

  return sessionRepository.createUserSession(idToken, '/')
}
