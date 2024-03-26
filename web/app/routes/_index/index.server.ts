import { ActionFunction, LoaderFunction } from '@remix-run/node'
import {
  EventStatus,
  User,
  createEvent,
  getEvents,
  getStocks,
} from '~/firebase.server'
import { EventType } from '~/type'
import { verifySession } from '~/session.server'
import { Timestamp } from 'firebase-admin/firestore'

export const homeLoader: LoaderFunction = async ({ request }) => {
  return verifySession(request, async () => {
    return {
      data: { stocks: await getStocks(), events: await getEvents() },
      status: 200,
    }
  })
}

export const homeAction: ActionFunction = async ({ request }) => {
  return verifySession(request, async (user: User) => {
    const formData = await request.formData()
    const type = formData.get('type')?.toString() as EventType

    if (!type) {
      return { error: 'Missing type', status: 400 }
    }

    const requestBody = {
      type,
      status: EventStatus.QUEUED,
      createdBy: user.username,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    try {
      console.log('Creating event: ', requestBody)
      const docRef = await createEvent(requestBody)
      console.log('Event created: ', docRef.id)

      return { data: { msg: `Event created: ${docRef.id}` }, status: 200 }
    } catch (error) {
      console.log('Catch error:', error)
      return { error: 'Error occur when creating event', status: 500 }
    }
  })
}
