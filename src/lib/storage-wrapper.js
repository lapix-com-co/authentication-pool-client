class StorageWrapper {
  constructor({ provider, parser, prefix }) {
    this._provider = provider
    this._parser = parser
    this._prefix = prefix
  }

  set(key, value) {
    const parsed = this._parser.stringify(value)
    return this._provider.set(this._normalizeKey(key), parsed)
  }

  async get(key) {
    const content = await this._provider.get(this._normalizeKey(key))
    return this._parser.parse(content)
  }

  remove(key) {
    return this._provider.remove(this._normalizeKey(key))
  }

  _normalizeKey(key) {
    return `${this._prefix}${key}`
  }
}

export class InMemoryProvider {
  constructor() {
    this.store = {}
  }

  async set(key, value) {
    this.store[key] = value
  }

  async get(key) {
    return this.store[key]
  }

  async remove(key) {
    delete this.store[key]
  }
}

export const JSONParser = JSON

export default StorageWrapper
