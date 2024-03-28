import { CreateUserPayload, User } from '~/type'

export interface IUserRepository {
  createUser: (docId: string, payload: CreateUserPayload) => Promise<void>
  getUser: (email: string) => Promise<User>
}
