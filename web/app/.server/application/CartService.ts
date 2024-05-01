import { Cart, ItemToStockRowData, StockRowData, User } from '~/common/type'
import { db } from '../infrastructure/firebase'
import { WriteResult } from 'firebase-admin/firestore'

export interface ICartService {
  createUserCart: (email: string, payload: Cart) => Promise<WriteResult>
  updateUserCart: (email: string, payload: Cart) => Promise<WriteResult>
  getUserCart: (email: string) => Promise<Cart>
  deleteUserCart: (email: string) => Promise<WriteResult>
  deleteCartItem: (email: string, item: StockRowData) => Promise<WriteResult>
}

async function createUserCart(email: string, payload: Cart) {
  try {
    return db.collection('carts').doc(email).set(payload)
  } catch (error) {
    console.log('Caught error creating cart document: ', error)
    throw new Error('Handled error creating cart document')
  }
}

async function updateUserCart(email: string, payload: Cart) {
  try {
    const updatedItemsMap: ItemToStockRowData = {}
    payload.items.map(item => {
      updatedItemsMap[item['Item Code']+item.Location+item.Batch] = item
    })
    const updatedItems: StockRowData[] = payload.items // We use all items in the updated payload

    const existingItems: StockRowData[] = (await getUserCart(email)).items
    existingItems.forEach(item => {
      const itemUniqueName = item['Item Code']+item.Location+item.Batch
      if (!(itemUniqueName in updatedItemsMap)) {
        updatedItems.push(item) // Add existing item in old cart that is not in the payload to new cart
      }
    })
    return db.collection('carts').doc(email).update({items: updatedItems})
  } catch (error) {
    console.log('Caught error creating cart document: ', error)
    throw new Error('Handled error creating cart document')
  }
}

async function getUserCart(email: string) {
  const docSnapshot = await db
    .collection('carts')
    .doc(email.toLowerCase())
    .get()

  if (!docSnapshot.exists) {
    throw new Error('Cart does not exist')
  }

  return docSnapshot.data() as Cart
}

async function deleteUserCart(email: string) {
  return db.collection('carts').doc(email.toLowerCase()).delete()
}

async function deleteCartItem(email: string, item: StockRowData) {
  const existingCart: Cart = await getUserCart(email)
  if (existingCart === undefined) {
    throw new Error('Handled error delete cart item')
  }
  const updatedItems: StockRowData[] = existingCart.items.filter(data => data !== item)
  return db
    .collection('carts')
    .doc(email.toLowerCase())
    .update({items: updatedItems})
}

export const cartService: ICartService = {
  createUserCart,
  updateUserCart,
  getUserCart,
  deleteUserCart,
  deleteCartItem
}
