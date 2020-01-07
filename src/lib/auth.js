import { SIGN_OUT_EVENT, SIGN_UP_EVENT, SIGNED_IN_EVENT, VALIDATE_EMAIL_EVENT } from './event-handler'
import { SessionExpiredError } from './token-manager'

const CUSTOMER_INFO = 'customerInfo'

class Auth {
  constructor({ bus, storage, api, tokenProvider }) {
    this._bus = bus
    this._storage = storage
    this._api = api
    this._tokenProvider = tokenProvider

    this._addListeners()
  }

  _addListeners() {
    const validateEmailListener = this._bus.subscribe(
      VALIDATE_EMAIL_EVENT,
      (message, data) => this._tokenProvider.save(data),
    )
    this._listeners = [validateEmailListener]
  }

  removeListeners() {
    this._listeners.forEach(removeListener => removeListener())
  }

  async check() {
    const tokens = await this._tokenProvider.currentTokens()
    return !!tokens
  }

  async currentSession() {
    let tokens = null
    const notAuthenticatedMessage = 'User not authenticated'

    try {
      tokens = await this._tokenProvider.getValidTokens()
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        await this.signOut()
        throw new Error(notAuthenticatedMessage)
      }

      throw error
    }

    if (!tokens) {
      throw new Error(notAuthenticatedMessage)
    }

    return { tokens }
  }

  async signUp({ email, password }) {
    const data = await this._api.signUp({ email, password })
    this._bus.publish(SIGN_UP_EVENT, data)
  }

  async signIn({ provider, email, secret }) {
    if (!provider) {
      throw new Error('provider can not be empty')
    }

    if (!email) {
      throw new Error('email can not be empty')
    }

    if (!secret) {
      throw new Error('secret can not be empty')
    }

    const data = await this._api.signIn({ provider, email, secret })
    await this._tokenProvider.save(data)
    await this._saveProfile(data.customer)
    this._bus.publish(SIGNED_IN_EVENT, data)
  }

  getCurrentCustomer() {
    return this._storage.get(CUSTOMER_INFO)
  }

  _saveProfile(customer) {
    return this._storage.set(CUSTOMER_INFO, customer)
  }

  _clearCustomer() {
    return this._storage.remove(CUSTOMER_INFO)
  }

  async signOut() {
    await this._tokenProvider.clear()
    this._bus.publish(SIGN_OUT_EVENT, null)
    this._clearCustomer()
    return null
  }
}

export default Auth
