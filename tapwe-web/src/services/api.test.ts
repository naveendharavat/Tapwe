import MockAdapter from 'axios-mock-adapter'
import { api, getErrorMessage, onUnauthorized } from './api'
import { getToken, setToken } from '../auth/token'

describe('api client', () => {
  const mock = new MockAdapter(api)
  afterEach(() => mock.reset())

  it('attaches the stored token as a Bearer header', async () => {
    setToken('abc')
    mock.onGet('/cards').reply((config) => [200, { auth: config.headers?.Authorization }])
    const res = await api.get('/cards')
    expect(res.data.auth).toBe('Bearer abc')
  })

  it('clears the token and notifies on a 401', async () => {
    setToken('expired')
    const handler = vi.fn()
    const unsubscribe = onUnauthorized(handler)
    mock.onGet('/cards').reply(401, { message: 'Your session has expired. Please sign in again.' })

    await expect(api.get('/cards')).rejects.toBeTruthy()

    expect(getToken()).toBeNull()
    expect(handler).toHaveBeenCalledTimes(1)
    unsubscribe()
  })

  it('does not treat a failed sign-in as an expired session', async () => {
    const handler = vi.fn()
    const unsubscribe = onUnauthorized(handler)
    mock.onPost('/auth/sign-in').reply(401, { message: 'Incorrect email or password.' })
    await expect(api.post('/auth/sign-in')).rejects.toBeTruthy()
    expect(handler).not.toHaveBeenCalled()
    unsubscribe()
  })

  it('extracts the first server message for display', async () => {
    mock.onPost('/card-requests').reply(400, { message: ['Enter your name.', 'Enter a valid email address.'] })
    const error = await api.post('/card-requests').catch((e: unknown) => e)
    expect(getErrorMessage(error)).toBe('Enter your name.')
  })
})
