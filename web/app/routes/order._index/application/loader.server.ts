import { LoaderFunction } from "@remix-run/node"
import { verifySession } from "~/session.server"

export const orderLoader: LoaderFunction = async ({ request }) => {
  return verifySession(request)
}
