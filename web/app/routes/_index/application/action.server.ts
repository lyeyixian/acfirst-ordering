import { ActionFunction } from '@remix-run/node'
import { eventService } from '~/.server/application/EventService'
import { sessionService } from '~/.server/application/SessionService'
import { EventType, User } from '~/common/type'


const createEvent = async (type: EventType, user: User) => {
  try {
    console.log('Creating event: ', type)
    const docRef = await eventService.createEvent(type, user)
    console.log('Event created: ', docRef.id)

    return { data: { msg: `Event created: ${docRef.id}` }, status: 200 }
  } catch (error) {
    console.log('Catch error:', error)
    return { error: 'Error occur when creating event', status: 500 }
  }
}

const retryEvent = async (orderId: string) => {
  try {
    console.log('Retrying event: ', orderId)
    await eventService.retryEvent(orderId)
    return { data: { msg: `Event retried: ` + orderId }, status: 200 }
  } catch (error) {
    console.log('Catch error:', error)
    return { error: 'Error occur when retrying event', status: 500 }
  }
}


const deleteEvent = async (orderId: string) => {
  try {
    console.log('Deleting event: ', orderId)
    await eventService.deleteEvent(orderId)
    return { data: { msg: `Event deleted: ` + orderId }, status: 200 }
  } catch (error) {
    console.log('Catch error:', error)
    return { error: 'Error occur when deleting event', status: 500 }
  }
}

export const homeAction: ActionFunction = async ({ request }) => {
  return sessionService.verifySession(request, async (user: User) => {
    const formData = await request.formData()
    const type = formData.get('type')?.toString() as EventType
    const retryOrderId = formData.get('retryOrderId')?.toString()
    const deleteOrderId = formData.get('deleteOrderId')?.toString()

    if (type) return createEvent(type, user); // For refreshStocks at StocksTable
    if (retryOrderId) return retryEvent(retryOrderId); // For retryEvent at OrderHistory ActionEventRenderer
    if (deleteOrderId) return deleteEvent(deleteOrderId) // For deleteEvent at OrderHistory ActionEventRenderer

    if (!type) {
      return { error: 'Missing type', status: 400 }
    }

    if (!retryOrderId) {
      return { error: 'Missing order Id', status: 400 }
    }

    return { error: 'Unexpected Error', status: 500}
  })
}