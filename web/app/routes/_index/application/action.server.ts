import { ActionFunction } from '@remix-run/node'
import { eventService } from '~/.server/application/EventService'
import { sessionService } from '~/.server/application/SessionService'
import { EventType, User } from '~/common/type'

export const homeAction: ActionFunction = async ({ request }) => {
  return sessionService.verifySession(request, async (user: User) => {
    const formData = await request.formData()
    const type = formData.get('type')?.toString() as EventType

    if (!type) {
      return { error: 'Missing type', status: 400 }
    }

    try {
      console.log('Creating event: ', type)
      const docRef = await eventService.createEvent(type, user)
      console.log('Event created: ', docRef.id)

      return { data: { msg: `Event created: ${docRef.id}` }, status: 200 }
    } catch (error) {
      console.log('Catch error:', error)
      return { error: 'Error occur when creating event', status: 500 }
    }
  })
}
