import { useRouteLoaderData } from '@remix-run/react'
import { homeLoader } from '~/routes/_index/application/loader.server'

export const useCart = () => {
  const rootLoaderData = useRouteLoaderData<typeof homeLoader>('routes/_index')
  const { cart } = rootLoaderData.data

  return {
    cart,
  }
}
