import { Cart } from '~/common/type'
import { CheckoutTable } from './CheckoutTable'

export default function CheckoutModalBody({ cart }: { cart: Cart }) {
  return (
    <div>
      <CheckoutTable cartItems={cart.items} />
    </div>
  )
}
