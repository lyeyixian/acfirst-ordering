import { type LoaderFunction, type MetaFunction } from '@remix-run/node'
import { Welcome } from '~/components/Welcome/Welcome'
import { ColorSchemeToggle } from '~/components/ColorSchemeToggle/ColorSchemeToggle'
import { verifySession } from '~/session.server'
import { useLoaderData } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Acfirst Ordering' },
    { name: 'description', content: 'Welcome to Acfirst Ordering!' },
  ]
}

export const loader: LoaderFunction = async ({ request }) => {
  return verifySession(request)
}

export default function Index() {
  const data = useLoaderData()

  console.log('DEBUG data: ', data)

  return (
    <div>
      <Welcome />
      <ColorSchemeToggle />
    </div>
  )
}
