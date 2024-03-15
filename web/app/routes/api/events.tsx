import { getUserSessionEmail } from "~/utils/session.server";
import { refreshStocks, getUser } from "~/utils/db.server";

export async function action({ request }: {request : Request}) {
  const userEmail = await getUserSessionEmail(request);
  const user = await getUser(userEmail);
  if (!user.exists || user.data() === null || user.data() === undefined) {
    throw new Error('Missing user information!')
  }

  const formData = await request.formData()

  const requestBody = {
    "id": user.data().userId,
    "name": formData.get('event'),
    "payload": {},
    "status": "queued",
    "createdBy": user.data().username,
    "createdAt": Date.now(),
    "updatedAt": Date.now()
  }
  return await refreshStocks(requestBody)
}
