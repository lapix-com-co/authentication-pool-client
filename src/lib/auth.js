import { SIGN_OUT_EVENT, SIGN_UP_EVENT, SIGNED_IN_EVENT, VALIDATE_EMAIL_EVENT } from './event-handler'
import { SessionExpiredError } from './token-manager'

class Auth {
  constructor({ bus, api, tokenProvider }) {
    this._bus = bus
    this._api = api
    this._tokenProvider = tokenProvider

    this._addListeners()
  }

  _addListeners() {
    const validateEmailListener = this._bus.subscribe(
      VALIDATE_EMAIL_EVENT,
      data => this._tokenProvider.save(data),
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
    try {
      const data = await this._api.signIn({ provider, email, secret })
      this._tokenProvider.save(data)
      this._bus.publish(SIGNED_IN_EVENT, data)
    } catch (error) {
      throw new Error(`api error: ${error.message}`)
    }
  }

  async signOut() {
    await this._tokenProvider.clear()
    this._bus.publish(SIGN_OUT_EVENT, null)
    return null
  }
}

export default Auth
