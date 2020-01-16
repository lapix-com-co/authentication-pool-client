import { REFRESH_TOKEN_EVENT } from './event-handler'

const AUTH_TOKENS_KEY = 'authentication-pool.auth-tokens'

export class SessionExpiredError extends Error {
}

class TokenManager {
  /**
   * @param api
   * @param storage
   * @param bus
   * @param timeProvider
   * @param logger
   */
  constructor({ api, storage, bus, timeProvider, logger }) {
    this._api = api
    this._storage = storage
    this._bus = bus
    this._timeProvider = timeProvider
    this._logger = logger
  }

  /**
   * Returns the current tokens, does not matter if those are not valid.
   * @returns {*}
   */
  currentTokens() {
    return this._storage.get(AUTH_TOKENS_KEY)
  }

  /**
   * Insert replace the current session tokens and add a timestamp when the tokens
   * where saved. This is helpful if the device does not have the same time
   * configuration that the server.
   * @param data
   * @returns {*}
   */
  insert(data) {
    const tokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }

    // Stores the unix time stamp
    tokens.accessToken.timeStamp = this._timeProvider.now().getTime() / 1000

    return this._storage.set(AUTH_TOKENS_KEY, tokens)
  }

  /**
   * Update just replace the current tokens.
   * @param data
   * @returns {*}
   */
  _update(data) {
    const tokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }

    return this._storage.set(AUTH_TOKENS_KEY, tokens)
  }

  /**
   * Get the current tokens. If the token has expired it issues a
   * new one. If the refresh token is not valid it clears the current session.
   * @returns {Promise<{accessToken}|*|null>}
   */
  async getValidTokens() {
    let tokens = await this.currentTokens()
    if (!tokens || !tokens.accessToken) {
      this._logger.debug('there are no tokens')
      return null
    }

    const unixTimeExpiredAt = tokens.accessToken.timeToLive + tokens.accessToken.timeStamp
    const expiredAt = new Date(unixTimeExpiredAt * 1000).getTime()
    const currentTime = this._timeProvider.now().getTime()

    if (expiredAt > currentTime) {
      this._logger.debug('tokens are valid')
      return tokens
    }

    this._logger.debug('access token has expired', {
      expiredAt,
      currentTime,
      tokens,
    })

    try {
      return await this._refreshToken()
    } catch (error) {
      if (error.message.match(/the given token is not valid/i)) {
        this._logger.debug('the given refresh token is not valid')
        await this.clear()
        throw new SessionExpiredError('The given session has expired')
      }

      throw error
    }
  }

  /**
   * @returns {void | Promise<void> | Promise<void>}
   */
  clear() {
    return this._storage.remove(AUTH_TOKENS_KEY)
  }

  /**
   * @returns {Promise<*>}
   * @private
   */
  async _refreshToken() {
    const tokens = await this.currentTokens()
    let data = null

    this._logger.debug('will refresh the access token', tokens)

    // This ensures that the next request to refresh the
    // token does not call this method again.
    await this.clear()

    try {
      data = await this._api.refreshToken(
        tokens.accessToken.token,
        tokens.refreshToken.token,
      )
      this._logger.debug('the refresh token result', data)
    } catch (error) {
      // If the error is due to the network connection  we can try again later.
      this._logger.debug('could not refresh the token', error)
      await this._update(tokens)
      throw error
    }

    tokens.accessToken = data.accessToken

    await this.insert(tokens)
    this._bus.publish(REFRESH_TOKEN_EVENT, data)

    return tokens
  }
}

export default TokenManager
