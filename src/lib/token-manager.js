import { REFRESH_TOKEN_EVENT } from './event-handler'

const AUTH_TOKENS_KEY = 'authentication-pool.auth-tokens'

export class SessionExpiredError extends Error {
}

class TokenManager {
  constructor({ api, storage, bus, timeProvider }) {
    this._api = api
    this._storage = storage
    this._bus = bus
    this._timeProvider = timeProvider
  }

  currentTokens() {
    return this._storage.get(AUTH_TOKENS_KEY)
  }

  save(data) {
    const tokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }

    return this._storage.set(AUTH_TOKENS_KEY, tokens)
  }

  async getValidTokens() {
    let tokens = await this.currentTokens()
    if (!tokens) {
      return null
    }

    const expiredAt = new Date(tokens.accessToken.expiredAt * 1000).getTime()
    const currentTime = this._timeProvider.now().getTime()

    if (expiredAt > currentTime) {
      return tokens
    }

    try {
      return await this._refreshToken()
    } catch (error) {
      if (error.message.match(/the given token is not valid/i)) {
        await this.clear()
        throw new SessionExpiredError('The given session has expired')
      }

      throw error
    }
  }

  clear() {
    return this._storage.remove(AUTH_TOKENS_KEY)
  }

  async _refreshToken() {
    const tokens = await this.currentTokens()
    let data = null
    // This ensures that the next request to refresh the
    // token does not call this method again.
    await this.clear()

    try {
      data = await this._api.refreshToken(
        tokens.accessToken.token,
        tokens.refreshToken.token,
      )
    } catch (error) {
      // If the error is due to the network connection  we can try again later.
      if (error.networkError) {
        await this.save(tokens)
      }

      throw error
    }

    tokens.accessToken = data.accessToken

    await this.save(tokens)
    this._bus.publish(REFRESH_TOKEN_EVENT, data)

    return tokens
  }
}

export default TokenManager
