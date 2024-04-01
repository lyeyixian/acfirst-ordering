import { DocumentReference } from 'firebase-admin/firestore'
import { Event } from '~/common/type'

export interface IEventRepository {
  getEvents: () => Promise<Event[]>
  createEvent: (event: Event) => Promise<DocumentReference>
}
