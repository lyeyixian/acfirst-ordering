import { useLoaderData } from '@remix-run/react'
import { checkoutLoader } from '../application/loader.server'

export default function CheckoutPage() {
  const loaderData = useLoaderData<typeof checkoutLoader>()
  console.log(loaderData)
  return (
    <div>
      <h1>Checkout</h1>
    </div>
  )
}
