import event from '../src/lib/event-handler'
import API from '../src/lib/api'

export const getAPI = () => new API()

export const eventHandler = () => Object.assign({}, event)
