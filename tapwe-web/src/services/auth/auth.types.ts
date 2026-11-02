export type UserRole = 'owner' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
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
