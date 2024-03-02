import type { MetaFunction } from '@remix-run/node'
import { Welcome } from '~/components/Welcome/Welcome'
import { ColorSchemeToggle } from '~/components/ColorSchemeToggle/ColorSchemeToggle'
import { Form, redirect } from '@remix-run/react'
import { signOut, getUserSession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: 'Mantine Remix App' },
    { name: 'description', content: 'Welcome to Mantine!' },
  ]
}

export let action = ({ request }: {request: Request}) => {
  return signOut(request);
};

export let loader = async ({ request }: {request: Request}) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/login");
  }

  return null;
};


export default function Index() {
  return (
    <div className="remix__page">
    <main>
      <h2>Welcome to Remix Firebase demo</h2>

      <Form method="post">
        <button type="submit">Sign Out</button>
      </Form>
    </main>
  </div>
    // <div>
    //   <Welcome />
    //   <ColorSchemeToggle />
    // </div>
  )
}