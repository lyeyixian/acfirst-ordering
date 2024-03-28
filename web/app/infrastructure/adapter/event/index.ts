import { db } from '~/infrastructure/firebase'
import { EventRepository } from './EventRepository'

const eventRepository = EventRepository(db)

export { eventRepository }
