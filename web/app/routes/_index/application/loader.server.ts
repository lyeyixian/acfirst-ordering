import { LoaderFunction } from '@remix-run/node'
import { cartService } from '~/.server/application/CartService'
import { eventService } from '~/.server/application/EventService'
import { sessionService } from '~/.server/application/SessionService'
import { stockService } from '~/.server/application/StockService'

export const homeLoader: LoaderFunction = async ({ request }) => {
  return sessionService.verifySession(request, async (user) => {
    return {
      data: {
        stocks: await stockService.getStocks(),
        events: await eventService.getEventsForUser(user),
        cart: await cartService.getUserCart(user.email),
      },
      status: 200,
    }
  })
}
