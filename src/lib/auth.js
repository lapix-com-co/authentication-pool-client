import { SessionExpiredError } from './token-manager'
import {
  SIGN_OUT_EVENT,
  SIGN_UP_EVENT,
  SIGNED_IN_EVENT,
  VALIDATE_EMAIL_EVENT,
} from './event-handler'

const CUSTOMER_INFO = 'customerInfo'

class Auth {
  /**
   * @param bus
   * @param storage
   * @param api
   * @param tokenProvider
   */
  constructor({ bus, storage, api, tokenProvider }) {
    this._bus = bus
    this._storage = storage
    this._api = api
    this._tokenProvider = tokenProvider

    this._addListeners()
  }

  /**
   * @private
   */
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

  /**
   * Check if the current session has tokens.
   * @returns {Promise<boolean>}
   */
  async check() {
    const tokens = await this._tokenProvider.currentTokens()
    return !!tokens
  }

  /**
   * Returns the active token, if the current
   * session has expired removes the session.
   * @returns {Promise<{tokens: ({accessToken}|*)}>}
   */
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

  /**
   * @param email
   * @param password
   * @returns {Promise<void>}
   */
  async signUp({ email, password }) {
    const data = await this._api.signUp({ email, password })
    this._bus.publish(SIGN_UP_EVENT, data)
  }

  /**
   * @param provider
   * @param email
   * @param secret
   * @returns {Promise<void>}
   */
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
    await this._tokenProvider.insert(data)
    await this._saveProfile(data.customer)
    this._bus.publish(SIGNED_IN_EVENT, data)
  }

  /**
   * Returns the decoded token content.
   * @returns {*}
   */
  getCurrentCustomer() {
    return this._storage.get(CUSTOMER_INFO)
  }

  /**
   * @param customer
   * @returns {*}
   * @private
   */
  _saveProfile(customer) {
    return this._storage.set(CUSTOMER_INFO, customer)
  }

  /**
   * @returns {void | Promise<void> | Promise<void>}
   * @private
   */
  _clearCustomer() {
    return this._storage.remove(CUSTOMER_INFO)
  }

  /**
   * @returns {Promise<null>}
   */
  async signOut() {
    await this._tokenProvider.clear()
    this._bus.publish(SIGN_OUT_EVENT, null)
    this._clearCustomer()
    return null
  }
}

export default Auth
