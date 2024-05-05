import { Cart, CartItem, ItemToCartItem, StockRowData, User } from '~/common/type'
import { db } from '../infrastructure/firebase'
import { WriteResult } from 'firebase-admin/firestore'
import { NoCartFoundError } from '~/common/errors'

export interface ICartService {
  createUserCart: (userId: string, payload: Cart) => Promise<WriteResult>
  updateUserCart: (userId: string, payload: Cart) => Promise<WriteResult>
  getUserCart: (userId: string) => Promise<Cart>
  deleteUserCart: (userId: string) => Promise<WriteResult>
  deleteCartItem: (userId: string, item: CartItem) => Promise<WriteResult>
}

async function createUserCart(userId: string, payload: Cart) {
  try {
    return db.collection('carts').doc(userId).set(payload)
  } catch (error) {
    console.log('Caught error creating cart document: ', error)
    throw new Error('Handled error creating cart document')
  }
}

async function updateUserCart(userId: string, payload: Cart) {
  try {
    const updatedItemsMap: ItemToCartItem = {}
    payload.items.map(item => {
      updatedItemsMap[item.stock.itemCode+item.stock.location+item.stock.batch] = item
    })
    const updatedItems: CartItem[] = payload.items // We use all items in the updated payload

    const existingItems: CartItem[] = (await getUserCart(userId)).items
    existingItems.forEach(item => {
      const itemUniqueName = item.stock.itemCode+item.stock.location+item.stock.batch
      if (!(itemUniqueName in updatedItemsMap)) {
        updatedItems.push(item) // Add existing item in old cart that is not in the payload to new cart
      }
    })
    return db.collection('carts').doc(userId).update({items: updatedItems})
  } catch (error) {
    console.log('Caught error creating cart document: ', error)
    throw new Error('Handled error creating cart document')
  }
}

async function getUserCart(userId: string) {
  const docSnapshot = await db
    .collection('carts')
    .doc(userId)
    .get()

  if (!docSnapshot.exists) {
    throw new NoCartFoundError('Cart does not exist')
  }

  return docSnapshot.data() as Cart
}

async function deleteUserCart(userId: string) {
  return db.collection('carts').doc(userId).delete()
}

async function deleteCartItem(userId: string, item: CartItem) {
  const existingCart: Cart = await getUserCart(userId)
  if (existingCart === undefined) {
    throw new Error('Handled error delete cart item')
  }
  const updatedItems: CartItem[] = existingCart.items.filter(data => data !== item)
  return db
    .collection('carts')
    .doc(userId)
    .update({items: updatedItems})
}

export const cartService: ICartService = {
  createUserCart,
  updateUserCart,
  getUserCart,
  deleteUserCart,
  deleteCartItem
}
