import { CreateUserPayload, User } from '~/common/type'

export interface IUserService {
  createUser: (docId: string, payload: CreateUserPayload) => Promise<void>
  getUser: (email: string) => Promise<User>
}
