import axios, { isAxiosError } from 'axios'
import { clearToken, getToken } from '../auth/token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
})

type Listener = () => void
const unauthorizedListeners = new Set<Listener>()

/** Subscribe to "the session is no longer valid". Returns an unsubscribe function. */
export function onUnauthorized(listener: Listener): () => void {
  unauthorizedListeners.add(listener)
  return () => unauthorizedListeners.delete(listener)
}

const AUTH_ROUTES = ['/auth/sign-in', '/auth/sign-up']

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(undefined, (error: unknown) => {
  const isAuthAttempt = isAxiosError(error) && AUTH_ROUTES.includes(error.config?.url ?? '')
  if (isAxiosError(error) && error.response?.status === 401 && !isAuthAttempt) {
    clearToken()
    unauthorizedListeners.forEach((listener) => listener())
  }
  return Promise.reject(error)
})

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (isAxiosError(error)) {
    const message = (error.response?.data as { message?: string | string[] } | undefined)?.message
    if (Array.isArray(message) && message.length) return message[0]
    if (typeof message === 'string' && message) return message
    if (!error.response) return 'Could not reach Tapwe. Check your connection and try again.'
  }
  return fallback
}
