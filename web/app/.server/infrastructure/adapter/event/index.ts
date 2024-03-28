import { db } from '~/.server/infrastructure/firebase'
import { EventRepository } from './EventRepository'

const eventRepository = EventRepository(db)

export { eventRepository }
