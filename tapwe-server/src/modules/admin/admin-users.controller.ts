import { Controller, Get } from '@nestjs/common';
import { Roles } from '../../common/decorators/auth.decorators.js';
import { UsersRepository, UserWithStats } from '../users/users.repository.js';

@Roles('admin')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly users: UsersRepository) {}

  @Get()
  list(): Promise<UserWithStats[]> {
    return this.users.findAllWithStats();
  }
}
