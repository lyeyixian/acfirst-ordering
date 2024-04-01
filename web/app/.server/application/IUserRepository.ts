import { CreateUserPayload, User } from '~/common/type'

export interface IUserRepository {
  createUser: (docId: string, payload: CreateUserPayload) => Promise<void>
  getUser: (email: string) => Promise<User>
}
