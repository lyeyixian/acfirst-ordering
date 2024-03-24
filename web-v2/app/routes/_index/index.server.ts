import { LoaderFunction } from '@remix-run/node'
import { getEvents, getStocks } from '~/firebase.server'
import { verifySession } from '~/session.server'

export const homeLoader: LoaderFunction = async ({ request }) => {
  return verifySession(request, async () => {
    return { stocks: await getStocks(), events: await getEvents() }
  })
}
