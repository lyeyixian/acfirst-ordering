import '@mantine/core/styles.css'

import { MantineProvider } from '@mantine/core'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from '@remix-run/react'
import dotenv from 'dotenv'
import { LoaderFunction } from '@remix-run/node'

declare global {
  interface Window {
    ENV: {
      API_KEY: string
      AUTH_DOMAIN: string
      DATABASE_URL: string
      PROJECT_ID: string
      STORAGE_BUCKET: string
      MESSAGING_SENDER_ID: string
      APP_ID: string
      MEASUREMENT_ID: string
    }
  }
}

export const loader: LoaderFunction = () => {
  dotenv.config()

  return json({
    ENV: {
      API_KEY: process.env.API_KEY,
      AUTH_DOMAIN: process.env.AUTH_DOMAIN,
      DATABASE_URL: process.env.DATABASE_URL,
      PROJECT_ID: process.env.PROJECT_ID,
      STORAGE_BUCKET: process.env.STORAGE_BUCKET,
      MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
      APP_ID: process.env.APP_ID,
      MEASUREMENT_ID: process.env.MEASUREMENT_ID,
    },
  })
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
        <ScrollRestoration />
        <script
          // to add env variables to the window object
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
