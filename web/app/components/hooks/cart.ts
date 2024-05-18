import { useMatches, useRouteLoaderData } from '@remix-run/react'
import { Cart } from '~/common/type'
import { homeLoader } from '~/routes/_index/application/loader.server'

export const useCart = () => {
  const rootLoaderData = useRouteLoaderData<typeof homeLoader>('routes/_index')
  const matches = useMatches()
  const shouldRender =
    matches
      .map((match) => match.id)
      .filter((id) => id.includes('auth') || id.includes('checkout')).length ===
    0
  let cart: Cart = { userId: '', items: [] }

  if (shouldRender) {
    cart = rootLoaderData.data.cart
  }

  return {
    cart,
    shouldRender,
  }
}
