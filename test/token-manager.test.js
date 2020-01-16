import TokenManager from '../src/lib/token-manager'
import sinon from 'sinon'
import { InMemoryProvider } from '../src/lib/storage-wrapper'
import eventHandler from '../src/lib/event-handler'
import API from '../src/lib/api'

const unixTime = date => date.getTime() / 1000

const currentDate = new Date(1995, 12, 4, 12, 0, 0, 0)

const validToken = {
  refreshToken: {},
  accessToken: {
    token: 'valid-token',

    // TimeStamp is the local record where time token when requested.
    timeStamp: unixTime(currentDate),
    // 50 seconds
    timeToLive: 50,
  },
}

const expiredToken = {
  refreshToken: {},
  accessToken: {
    token: 'expired-token',

    // The given token was generated 60 seconds ago, so the
    // token has expired by 10 seconds.
    timeStamp: unixTime(currentDate) - 60,
    // 50 seconds
    timeToLive: 50,
  },
}

it('should get the current tokens', async () => {
  const api = sinon.stub()
  const tokenManager = new TokenManager({
    api,
    storage: new InMemoryProvider(),
    bus: eventHandler,
    timeProvider: { now: () => currentDate },
  })

  await tokenManager._update(validToken)

  const currentToken = await tokenManager.getValidTokens()
  expect(currentToken).toEqual(validToken)
})

it('should refresh the tokens if are expired', async () => {
  const api = new API()
  const stub = sinon.stub(api, 'refreshToken')
  stub.returns(validToken)

  const tokenManager = new TokenManager({
    api,
    storage: new InMemoryProvider(),
    bus: eventHandler,
    timeProvider: { now: () => currentDate },
  })

  await tokenManager._update(expiredToken)

  const currentToken = await tokenManager.getValidTokens()
  expect(currentToken).toEqual(validToken)
})

it('should throw an error if the token can not be refreshed', async () => {
  const api = new API()
  const stub = sinon.stub(api, 'refreshToken')
  stub.throws(new Error('the given token is not valid'))

  const tokenManager = new TokenManager({
    api,
    storage: new InMemoryProvider(),
    bus: eventHandler,
    timeProvider: { now: () => currentDate },
  })

  await tokenManager._update(expiredToken)
  await expect(tokenManager.getValidTokens()).rejects.toThrow(/expired/)
})
