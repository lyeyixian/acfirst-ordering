import { Auth } from 'firebase-admin/auth'
import { Firestore } from 'firebase-admin/firestore'
import { IUserRepository } from '~/.server/application/IUserRepository'
import { CreateUserPayload, User } from '~/type'

export function FirebaseUserRepository(
  db: Firestore,
  auth: Auth
): IUserRepository {
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

  return {
    createUser,
    getUser,
  }
}
