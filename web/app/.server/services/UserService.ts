import { IUserService } from '~/.server/services/IUserService'
import { CreateUserPayload, User } from '~/common/type'
import { auth, db } from '../infrastructure/firebase'

async function createUser(docId: string, payload: CreateUserPayload) {
  try {
    await db.collection('users').doc(docId).set(payload)
  } catch (error) {
    console.log('Caught error creating user document: ', error)

    // need to delete user, else the user cant sign up again
    await auth.deleteUser(payload.userId)
    throw new Error('Handled error creating user document')
  }
}

async function getUser(email: string) {
  const docSnapshot = await db
    .collection('users')
    .doc(email.toLowerCase())
    .get()

  if (!docSnapshot.exists) {
    throw new Error('User does not exist')
  }

  return docSnapshot.data() as User
}

export const userService: IUserService = {
  createUser,
  getUser,
}
