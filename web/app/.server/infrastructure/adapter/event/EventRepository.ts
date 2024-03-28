import { Firestore } from 'firebase-admin/firestore'
import { IEventRepository } from '~/.server/application/IEventRepository'
import { Event } from '~/type'

export function EventRepository(db: Firestore): IEventRepository {
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

  return {
    getEvents,
    createEvent,
  }
}
