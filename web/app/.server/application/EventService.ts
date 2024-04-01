import {
  Event,
  EventPayload,
  EventStatus,
  EventType,
  User,
} from '~/common/type'
import { db } from '../infrastructure/firebase'
import { DocumentReference } from '@google-cloud/firestore'
import { Timestamp } from 'firebase-admin/firestore'

export interface IEventService {
  getEvents: () => Promise<Event[]>
  createEvent: (
    type: EventType,
    user: User,
    payload?: EventPayload
  ) => Promise<DocumentReference>
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

async function _createEvent(event: Event) {
  return db.collection('events').add(event)
}

async function createEvent(
  type: EventType,
  user: User,
  payload?: EventPayload
) {
  const event: Event = {
    type,
    payload: payload || null,
    status: EventStatus.QUEUED,
    createdBy: user.username,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  return _createEvent(event)
}

export const eventService: IEventService = {
  getEvents,
  createEvent,
}
