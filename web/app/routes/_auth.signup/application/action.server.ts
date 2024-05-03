import { json, type ActionFunction } from '@remix-run/node'
import { sessionService } from '~/.server/application/SessionService'
import { userService } from '~/.server/application/UserService'
import { BRANCH_NAME_TO_CODE } from '~/common/constants'

export const signUpAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const email = formData.get('email')?.toString() || ''
  const uid = formData.get('uid')?.toString() || ''
  const company = formData.get('company')?.toString() || ''
  const username = formData.get('username')?.toString() || ''
  const companyCode = BRANCH_NAME_TO_CODE[company]

  try {
    await userService.createUser(email, {
      email,
      company,
      username,
      userId: uid,
      companyCode
    })
  } catch (error) {
    console.log(error)

    return json(
      { error: 'Error creating user. Please try again' },
      { status: 500 }
    )
  }

  const idToken = formData.get('idToken')?.toString() || ''

  return sessionService.createUserSession(idToken, '/')
}
