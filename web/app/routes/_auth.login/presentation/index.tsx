import { Link } from '@remix-run/react'
import { useLogin } from '~/hooks/auth/hooks'

export default function LoginPage() {
  const { handleSubmit } = useLogin()

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
