import { LoaderFunction } from '@remix-run/node'
import { sessionRepository } from '~/adapter/auth'
import { getEvents, getStocks } from '~/firebase.server'

export const homeLoader: LoaderFunction = async ({ request }) => {
  return sessionRepository.verifySession(request, async () => {
    return {
      data: { stocks: await getStocks(), events: await getEvents() },
      status: 200,
    }
  })
}
