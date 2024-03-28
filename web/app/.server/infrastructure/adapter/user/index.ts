import { auth, db } from '~/.server/infrastructure/firebase'
import { FirebaseUserRepository } from './FirebaseUserRepository'

const userRepository = FirebaseUserRepository(db, auth)

export { userRepository }
