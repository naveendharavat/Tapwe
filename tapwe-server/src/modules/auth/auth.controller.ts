import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CurrentUser, Public } from '../../common/decorators/auth.decorators.js';
import type { AuthUser } from '../../common/types/auth-user.js';
import { UserResponse } from '../users/users.mapper.js';
import { UsersService } from '../users/users.service.js';
import { AuthResponse, AuthService } from './auth.service.js';
import { SignInDto } from './dto/sign-in.dto.js';
import { SignUpDto } from './dto/sign-up.dto.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Public()
  @Post('sign-up')
  signUp(@Body() dto: SignUpDto): Promise<AuthResponse> {
    return this.auth.signUp(dto);
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() dto: SignInDto): Promise<AuthResponse> {
    return this.auth.signIn(dto);
  }

  @Get('me')
  me(@CurrentUser() user: AuthUser): Promise<UserResponse> {
    return this.users.getMe(user.id);
  }
}
