import { User, UserRole } from './entities/user.entity.js';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export function toUserResponse(user: User): UserResponse {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
