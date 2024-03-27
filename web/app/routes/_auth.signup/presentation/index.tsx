import { Link } from '@remix-run/react'
import { useSignUp } from '~/application/auth/hooks'

export default function SignUpPage() {
  const { handleSubmit } = useSignUp()

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
