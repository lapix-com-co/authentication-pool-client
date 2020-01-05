import StorageWrapper, { InMemoryProvider } from '../src/lib/storage-wrapper'
import sinon from 'sinon'

const getParser = () => ({ stringify: JSON.stringify, parse: JSON.parse })

it('should set a parsed value with the prefix', async () => {
  const storage = new InMemoryProvider()
  const mock = sinon.mock(storage)

  mock.expects('set').once().withExactArgs('test:value', '{"a":1}')

  const store = new StorageWrapper({
    provider: storage,
    parser: getParser(),
    prefix: 'test:',
  })

  await store.set('value', { a: 1 })
  mock.verify()
})

it('should get the value by the key with the prefix', async () => {
  const storage = new InMemoryProvider()

  const store = new StorageWrapper({
    provider: storage,
    parser: getParser(),
    prefix: 'test:',
  })

  store.set('value', { a: 1 })

  const value = await store.get('value')
  expect(value).toEqual({ a: 1 })
})

it('should remove the value by the key with the prefix', async () => {
  const storage = new InMemoryProvider()

  const store = new StorageWrapper({
    provider: storage,
    parser: getParser(),
    prefix: 'test:',
  })

  store.set('value', { a: 1 })

  await store.remove('value')
  const value = await store.remove('value')
  expect(value).toBeUndefined()
})
