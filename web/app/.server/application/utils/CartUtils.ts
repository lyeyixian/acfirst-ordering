import { Cart } from '~/common/type'

export function emptyCart(userId: string): Cart {
  return { userId, items: [] }
}
