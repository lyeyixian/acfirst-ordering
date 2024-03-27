import { TypedResponse } from '@remix-run/node'
import { User } from '~/firebase.server'
import { CallbackData, ResponseData } from '~/type'

export interface ISessionRepository {
  createUserSession: (
    idToken: string,
    redirectTo: string
  ) => Promise<TypedResponse>
  verifySession: (
    request: Request,
    callback?: (user: User) => Promise<CallbackData>
  ) => Promise<TypedResponse<ResponseData>>
  destroyUserSession: (request: Request) => Promise<TypedResponse>
}
