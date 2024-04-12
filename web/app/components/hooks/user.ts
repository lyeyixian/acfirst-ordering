import { useRouteLoaderData } from '@remix-run/react'
import { User } from '~/common/type';

export const useUser = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rootLoaderData: any = useRouteLoaderData('routes/_index')
    let username: string = ""
    let email: string = ""
    let company: string = ""
    let userId: string = ""

    if (rootLoaderData) {
        const user : User = rootLoaderData.user;
        username = user.username;
        email = user.email;
        company = user.company;
        userId = user.userId;
    }

    return { username, email, company, userId }
}
