import {
  Event,
  EventPayload,
  EventStatus,
  EventType,
  User,
} from '~/common/type'
import { db } from '../infrastructure/firebase'
import { DocumentReference } from '@google-cloud/firestore'
import { Timestamp, WriteResult } from 'firebase-admin/firestore'

export interface IEventService {
  getEvents: () => Promise<Event[]>
  createEvent: (
    type: EventType,
    user: User,
    payload?: EventPayload
  ) => Promise<DocumentReference>
  getEventsForUser: (user: User) => Promise<Event[]>
  updateEvent: (
    id: string,
    type: EventType,
    user: User,
    payload?: EventPayload
  ) => Promise<WriteResult>
  deleteEvent: (id: string) => Promise<WriteResult>
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

  return db.collection('events').add(event)
}

async function getEventsForUser(user: User) {
  const querySnapshot = await db
    .collection('events')
    .where('createdBy', '==', user.username)
    .get()

  const data: Event[] = []

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as Event

    data.push({ ...docData, id: doc.id })
  })

  return data
}

async function updateEvent(
  id: string,
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

  return db.collection('events').doc(id).set(event)
}

async function deleteEvent(id: string) {
  return db.collection('events').doc(id).delete()
}

export const eventService: IEventService = {
  getEvents,
  createEvent,
  getEventsForUser,
  updateEvent,
  deleteEvent,
}
