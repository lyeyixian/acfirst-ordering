import { LoaderFunction } from '@remix-run/node'
import { cartService } from '~/.server/application/CartService'
import { sessionService } from '~/.server/application/SessionService'

export const checkoutLoader: LoaderFunction = async ({ request }) => {
  return sessionService.verifySession(request, async (user) => {
    return {
      data: {
        cart: await cartService.getUserCart(user.userId),
      },
      status: 200,
    }
  })
}
