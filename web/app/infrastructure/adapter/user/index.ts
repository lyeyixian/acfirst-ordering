import { auth, db } from '~/infrastructure/firebase'
import { FirebaseUserRepository } from './FirebaseUserRepository'

const userRepository = FirebaseUserRepository(db, auth)

export { userRepository }
