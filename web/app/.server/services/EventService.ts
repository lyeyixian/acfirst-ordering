import { IEventService } from '~/.server/services/IEventService'
import { Event } from '~/common/type'
import { db } from '../infrastructure/firebase'

async function getEvents() {
  const querySnapshot = await db.collection('events').get()

  const data: Event[] = []

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as Event

    data.push({ ...docData, id: doc.id })
  })

  return data
}

async function createEvent(event: Event) {
  return db.collection('events').add(event)
}

export const eventService: IEventService = {
  getEvents,
  createEvent,
}
