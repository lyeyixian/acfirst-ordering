import { Link, useFetcher } from '@remix-run/react'
import { SyntheticEvent, useCallback, useEffect } from 'react'
import { signUp } from '~/firebase.client'

interface FormTarget extends EventTarget {
  email?: { value: string }
  password?: { value: string }
  company?: { value: string }
  username?: { value: string }
}

export default function SignUpPage() {
  const fetcher = useFetcher()

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault()

      const target: FormTarget = e.target
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

  useEffect(() => {
    console.log('DEBUG fetcher', fetcher)
  }, [fetcher])

  return (
    <div className="signup">
      <h1>Sign Up Page</h1>

      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Email
            <input type="email" name="email" />
          </label>
        </p>
        <p>
          <label>
            Password
            <input type="password" name="password" />
          </label>
        </p>
        <p>
          <label>
            Company Name
            <input type="text" name="company" />
          </label>
        </p>
        <p>
          <label>
            Username
            <input type="text" name="username" />
          </label>
        </p>
        <button type="submit">Sign Up</button>
      </form>

      <Link to="/login">Go to Login</Link>
    </div>
  )
}
