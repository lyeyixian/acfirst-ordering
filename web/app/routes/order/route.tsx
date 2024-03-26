import { Outlet } from '@remix-run/react'

export default function OrderLayout() {
  return (
    <div>
      <h1>Order Layout</h1>
      <div>
        <Outlet />
      </div>
    </div>
  )
}
