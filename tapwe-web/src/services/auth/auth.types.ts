export type UserRole = 'owner' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest extends SignInRequest {
  name: string
}

export interface UpdateMeRequest {
  name?: string
  email?: string
}
