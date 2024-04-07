import { useFetcher } from '@remix-run/react'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { signIn } from '~/.client/firebase'

interface LoginFormTarget extends EventTarget {
  email?: { value: string }
  password?: { value: string }
}

export function useLogin() {
  const fetcher = useFetcher()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault()

    const target: LoginFormTarget = e.target
    const email = target.email?.value || ''
    const password = target.password?.value || ''

    try {
      console.log('signing in with email and password...')

      setIsLoading(true)

      const credential = await signIn(email, password)
      const idToken = await credential.user.getIdToken()

      console.log('signed in!')

      // Trigger a POST request which the action will handle
      fetcher.submit({ idToken }, { method: 'post', action: '/login' })
    } catch (e: unknown) {
      console.log('Error logging in!')
      console.error(e)
    }
  }, [])

  useEffect(() => {
    setIsLoading(fetcher.state !== 'idle')
  }, [fetcher])

  return {
    handleSubmit,
    isLoading: isLoading,
  }
}
