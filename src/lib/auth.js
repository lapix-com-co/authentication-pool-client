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
   * @param logger
   */
  constructor({ bus, storage, api, tokenProvider, logger }) {
    this._bus = bus
    this._storage = storage
    this._api = api
    this._tokenProvider = tokenProvider
    this._logger = logger

    this._addListeners()
  }

  /**
   * @private
   */
  _addListeners() {
    const validateEmailListener = this._bus.subscribe(
      VALIDATE_EMAIL_EVENT,
      (message, data) => {
        this._logger.debug(
          'inserting the token data after the VALIDATE_EMAIL_EVENT event',
          data,
        )
        this._tokenProvider.insert(data)
      },
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
    this._logger.debug('checking the current status')
    const tokens = await this._tokenProvider.currentTokens()
    this._logger.debug('current status', tokens)
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
      this._logger.debug('retrieving the current tokens')
      tokens = await this._tokenProvider.getValidTokens()
      this._logger.debug('found tokens', tokens)
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        this._logger.debug(
          'could not retrieve the current tokens because the refresh token has expired',
        )

        await this.signOut()
        throw new Error(notAuthenticatedMessage)
      }

      this._logger.debug('could not retrieve the current tokens', error)

      throw error
    }

    if (!tokens) {
      this._logger.debug('there are not valid tokens')
      throw new Error(notAuthenticatedMessage)
    }

    return { tokens }
  }

  /**
   * @param email
   * @param password
   * @param props
   * @returns {Promise<void>}
   */
  async signUp({ email, password, ...props }) {
    this._logger.debug('will sign up', email, props)
    const data = await this._api.signUp({ email, password, ...props })
    this._bus.publish(SIGN_UP_EVENT, data)
  }

  /**
   * Check if the given email, and the password are valid.
   * @param email
   * @param password
   * @param props
   * @returns {Promise<{result: boolean, message: [string]}>}
   */
  validateSignUp({ email, password, ...props }) {
    this._logger.debug('will validate the sign up values', email, props)
    return this._api.validateSignUp({ email, password, ...props })
  }

  /**
   * @param provider
   * @param email
   * @param secret
   * @returns {Promise<{isNewUser: boolean, customer: object, accessToken: object, refreshToken: object}>}
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

    this._logger.debug('will sign in', email, provider)
    const data = await this._api.signIn({ provider, email, secret })
    await this._tokenProvider.insert(data)
    await this._saveProfile(data.customer)
    this._bus.publish(SIGNED_IN_EVENT, data)
    return data
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
    this._logger.debug('will sign out')
    await this._tokenProvider.clear()
    this._bus.publish(SIGN_OUT_EVENT, null)
    this._clearCustomer()
    return null
  }
}

export default Auth
