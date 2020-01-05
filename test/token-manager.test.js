import TokenManager from '../src/lib/token-manager'
import sinon from 'sinon'
import { InMemoryProvider } from '../src/lib/storage-wrapper'
import eventHandler from '../src/lib/event-handler'
import API from '../src/lib/api'

const unixTime = date => date.getTime() / 1000

const validToken = {
  refreshToken: {},
  accessToken: {
    token: 'valid-token',
    expiredAt: unixTime(new Date(1995, 12, 5)),
  },
}

const expiredToken = {
  refreshToken: {},
  accessToken: {
    token: 'expired-token',
    expiredAt: unixTime(new Date(1995, 12, 3)),
  },
}

it('should get the current tokens', async () => {
  const api = sinon.stub()
  const tokenManager = new TokenManager({
    api,
    storage: new InMemoryProvider(),
    bus: eventHandler,
    timeProvider: { now: () => new Date(1995, 12, 4) },
  })

  await tokenManager.save(validToken)

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
    timeProvider: { now: () => new Date(1995, 12, 4) },
  })

  await tokenManager.save(expiredToken)

  const currentToken = await tokenManager.getValidTokens()
  expect(currentToken).toEqual(validToken)
})
