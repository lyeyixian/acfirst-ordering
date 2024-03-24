import { Link, useFetcher } from '@remix-run/react'
import type { SyntheticEvent } from 'react'
import { useCallback } from 'react'
import { signIn } from '~/firebase.client'

interface FormTarget extends EventTarget {
  email?: { value: string }
  password?: { value: string }
}

export default function LoginPage() {
  const fetcher = useFetcher()

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      const target: FormTarget = e.target
      const email = target.email?.value || ''
      const password = target.password?.value || ''

      try {
        console.log('signing in with email and password...')

        const credential = await signIn(email, password)
        const idToken = await credential.user.getIdToken()

        console.log('after signing in DEBUG idToken: ', idToken)

        // Trigger a POST request which the action will handle
        fetcher.submit({ idToken, email }, { method: 'post', action: '/login' })
      } catch (e: unknown) {
        console.log('Error logging in!')
        console.error(e)
      }
    },
    [fetcher]
  )

  return (
    <div className="login">
      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <div>
          <input type="email" name="email" id="email" />
        </div>

        <label htmlFor="password">Password</label>
        <div>
          <input type="password" name="password" id="password" />
        </div>

        <button type="submit">Login</button>
      </form>

      <Link to="/signup">Create Account</Link>
    </div>
  )
}
