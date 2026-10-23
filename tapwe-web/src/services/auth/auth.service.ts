import { api } from '../api'
import type { AuthResponse, SignInRequest, SignUpRequest, UpdateMeRequest, User } from './auth.types'

export class AuthService {
  static async signIn(body: SignInRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/sign-in', body)
    return data
  }

  static async signUp(body: SignUpRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/sign-up', body)
    return data
  }

  static async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  }

  static async updateMe(body: UpdateMeRequest): Promise<User> {
    const { data } = await api.patch<User>('/users/me', body)
    return data
  }
}
