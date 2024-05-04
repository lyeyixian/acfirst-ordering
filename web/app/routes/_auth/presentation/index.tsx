import { BackgroundImage } from '@mantine/core'
import { Outlet } from '@remix-run/react'

export default function AuthLayout() {
  return (
    <div>
      <BackgroundImage src="/login-page.avif">
        <Outlet />
      </BackgroundImage>
    </div>
  )
}
