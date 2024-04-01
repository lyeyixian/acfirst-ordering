import { useFetcher } from '@remix-run/react'
import { SyntheticEvent, useCallback } from 'react'
import { signIn } from '~/firebase.client'

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

        console.log('signed in!')

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
