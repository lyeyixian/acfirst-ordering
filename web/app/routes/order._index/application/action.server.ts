import { ActionFunction } from '@remix-run/node'
import { eventService } from '~/.server/application/EventService'
import { sessionService } from '~/.server/application/SessionService'
import { EventPayload, EventStockPayload, EventType } from '~/common/type'

export const orderAction: ActionFunction = async ({ request }) => {
  return sessionService.verifySession(request, async (user) => {
    const formData = await request.formData()

    const type = formData.get('type')?.toString() as EventType
    const Code = user.companyCode
    const itemCodes = formData.getAll('itemCode')
    const quantities = formData.getAll('quantity')

    const errors: Record<string, string> = {}
    if (!itemCodes || itemCodes.length === 0)
      errors.itemCodes = 'Item Codes are required'
    if (!quantities || quantities.length === 0)
      errors.quantities = 'Quantities are required'

    if (Object.keys(errors).length) {
      return { error: 'Missing required fields', data: errors, status: 400 }
    }

    const Data: EventStockPayload[] = []

    itemCodes.forEach((itemCode, i) =>
      Data.push({
        ItemCode: itemCode.toString(),
        Qty: parseInt(quantities[i].toString()),
      })
    )

    const payload: EventPayload = {
      Code,
      Data,
    }

    try {
      console.log('Creating event: ', type, 'with body: ', payload)
      const docRef = await eventService.createEvent(type, user, payload)
      console.log('Event created: ', docRef.id)

      return { data: { msg: `Event created: ${docRef.id}` }, status: 200 }
    } catch (error) {
      console.log('Catch error:', error)
      return { error: 'Error occur when creating event', status: 500 }
    }
  })
}
