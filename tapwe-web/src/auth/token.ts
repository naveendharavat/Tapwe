const KEY = 'tapwe.token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(KEY, token)
  } catch {
    // Storage can be unavailable (private mode); the session then lasts until reload.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
