import { Event } from '~/common/type'
import { db } from '../infrastructure/firebase'
import { DocumentReference } from '@google-cloud/firestore'

export interface IEventService {
  getEvents: () => Promise<Event[]>
  createEvent: (event: Event) => Promise<DocumentReference>
}

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
