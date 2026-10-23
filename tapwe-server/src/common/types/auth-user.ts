import { UserRole } from '../../modules/users/entities/user.entity.js';

export interface AuthUser {
  id: number;
  role: UserRole;
}

export interface JwtPayload {
  sub: number;
  role: UserRole;
}
