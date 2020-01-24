import { Auth, InMemoryProvider } from '../src'
import TokenProvider from '../src/lib/token-manager'
import sinon from 'sinon'
import { SIGN_UP_EVENT, SIGNED_IN_EVENT, VALIDATE_EMAIL_EVENT } from '../src/lib/event-handler'
import { getAPI, eventHandler } from './dummy-objects'

let fakeAPI = null
let fakeEvents = null
let fakeTokenProvider = null

const fakeSignIn = { provider: 'provider', email: 'email', secret: 'qwerty' }
const clientStub = sinon.stub()
const tokenProviderStub = sinon.stub(new TokenProvider({}))
const eventStub = sinon.stub(eventHandler())

const newAuth = options => new Auth({
  api: clientStub,
  tokenProvider: tokenProviderStub,
  storage: new InMemoryProvider(),
  bus: eventStub,
  logger: {
    debug: () => {
    },
  },
  ...options,
})

beforeEach(() => {
  fakeAPI = getAPI()
  fakeEvents = eventHandler()
  fakeTokenProvider = new TokenProvider({})
})

it('should add the "validate_email" event', async () => {
  const bus = eventHandler()
  const mock = sinon.mock(bus)
  mock.expects('subscribe').once().withArgs(VALIDATE_EMAIL_EVENT)
  newAuth({ bus })
  mock.verify()
})

it('should remove the listeners', async () => {
  const removeListener = sinon.spy()
  const bus = { subscribe: () => removeListener }
  const auth = newAuth({ bus })
  auth.removeListeners()
  expect(removeListener.called).toBe(true)
})

it('should return true if the current session has tokens', async () => {
  const tokenProvider = new TokenProvider({})
  const mock = sinon.mock(tokenProvider)
  mock.expects('currentTokens').once().returns({})
  const auth = newAuth({ tokenProvider })
  const validSession = await auth.check()
  mock.verify()
  expect(validSession).toBe(true)
})

it('should return false if the current session does not have tokens', async () => {
  const tokenProvider = new TokenProvider({})
  const mock = sinon.mock(tokenProvider)
  mock.expects('currentTokens').once().returns(null)
  const auth = newAuth({ tokenProvider })
  const validSession = await auth.check()
  mock.verify()
  expect(validSession).toBe(false)
})

it('should return the current session tokens', async () => {
  const tokenProvider = new TokenProvider({})
  const mock = sinon.mock(tokenProvider)
  mock.expects('getValidTokens').once().returns({ accessToken: {} })
  const auth = newAuth({ tokenProvider })
  const validSession = await auth.currentSession()
  mock.verify()
  expect(validSession).toStrictEqual({ tokens: { accessToken: {} } })
})

it('should throw an error if the current session is empty', async () => {
  const tokenProvider = new TokenProvider({})
  const mock = sinon.mock(tokenProvider)
  mock.expects('getValidTokens').once().returns(null)
  const auth = newAuth({ tokenProvider })
  await expect(auth.currentSession()).rejects.toThrow(/not authenticated/)
})

it('should validate the given sign up values', async () => {
  const api = getAPI()
  const stub = sinon.stub(api, 'validateSignUp')
  const data = { result: true }
  stub.returns(data)

  const auth = newAuth({ api })
  const result = await auth.validateSignUp(fakeSignIn)

  expect(result).toEqual(data)
})

it('should make a sign up request with the user data', async () => {
  const email = 'test@email.com'
  const password = 'qwerty'
  const params = { email, password }

  const api = getAPI()
  const mock = sinon.mock(api)
  mock.expects('signUp').once().withArgs(params).returns({ data: {} })

  const auth = newAuth({ api })
  await expect(auth.signUp({ email, password })).resolves.toBeUndefined()
})

it('should trigger the sign up event when everything is correct', async () => {
  const bus = eventHandler()
  const mock = sinon.mock(bus)
  const api = getAPI()
  const stub = sinon.stub(api, 'signUp')
  const data = { response: true }

  stub.returns(data)
  mock.expects('publish').once().withExactArgs(SIGN_UP_EVENT, data)

  const auth = newAuth({ bus, api })
  await auth.signUp({})
  mock.verify()
})

it('should make a sign in request with the user data', async () => {
  const email = 'test@email.com'
  const secret = 'qwerty'
  const provider = 'google'
  const params = { email, secret, provider }

  const api = getAPI()
  const mock = sinon.mock(api)
  mock.expects('signIn').once().withArgs(params).returns({ data: {} })

  const auth = newAuth({ api })
  await expect(auth.signIn({ email, secret, provider })).resolves.toBeUndefined()
})

it('should trigger the sign in event when everything is correct', async () => {
  const bus = eventHandler()
  const mock = sinon.mock(bus)
  const api = getAPI()
  const stub = sinon.stub(api, 'signIn')
  const data = { response: true }

  stub.returns(data)
  mock.expects('publish').once().withExactArgs(SIGNED_IN_EVENT, data)

  const auth = newAuth({ bus, api })
  await auth.signIn(fakeSignIn)
  mock.verify()
})

it('should store the customer profile', async () => {
  const api = getAPI()
  const stub = sinon.stub(api, 'signIn')
  const data = { customer: { id: 'nn', email: 'john@acme.com', name: 'John' } }
  stub.returns(data)

  const auth = newAuth({ api })
  await auth.signIn(fakeSignIn)

  const customer = await auth.getCurrentCustomer()
  expect(customer).toEqual(data.customer)
})
