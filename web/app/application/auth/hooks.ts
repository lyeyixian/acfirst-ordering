import { useFetcher } from '@remix-run/react'
import { SyntheticEvent, useCallback } from 'react'
import { signIn, signUp } from '~/firebase.client'

interface LoginFormTarget extends EventTarget {
  email?: { value: string }
  password?: { value: string }
}

export function useLogin() {
  const fetcher = useFetcher()

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      const target: LoginFormTarget = e.target
      const email = target.email?.value || ''
      const password = target.password?.value || ''

      try {
        console.log('signing in with email and password...')

        const credential = await signIn(email, password)
        const idToken = await credential.user.getIdToken()

        console.log('after signing in DEBUG idToken: ', idToken)

        // Trigger a POST request which the action will handle
        fetcher.submit({ idToken }, { method: 'post', action: '/login' })
      } catch (e: unknown) {
        console.log('Error logging in!')
        console.error(e)
      }
    },
    [fetcher]
  )

  return {
    handleSubmit,
  }
}

interface SignUpFormTarget extends EventTarget {
  email?: { value: string }
  password?: { value: string }
  company?: { value: string }
  username?: { value: string }
}

export function useSignUp() {
  const fetcher = useFetcher()

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      const target: SignUpFormTarget = e.target
      const email = target.email?.value || ''
      const password = target.password?.value || ''
      const company = target.company?.value || ''
      const username = target.username?.value || ''

      try {
        console.log('creating user ...')

        const credential = await signUp(email, password)

        console.log('user created')

        const user = credential.user
        const idToken = await user.getIdToken()
        const userEmail = user.email
        const uid = user.uid

        // Trigger a POST request which the action will handle
        fetcher.submit(
          { idToken, email: userEmail, uid, company, username },
          { method: 'post', action: '/signup' }
        )
      } catch (e: unknown) {
        console.error(e)
      }
    },
    [fetcher]
  )

  return {
    handleSubmit,
  }
}
