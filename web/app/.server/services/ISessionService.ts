import { TypedResponse } from '@remix-run/node'
import { User } from '~/common/type'
import { CallbackData, ResponseData } from '~/common/type'

export interface ISessionService {
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
