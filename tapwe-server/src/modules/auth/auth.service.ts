import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { JwtPayload } from '../../common/types/auth-user.js';
import { normalizeEmail } from '../../common/utils/normalize.js';
import { CardsRepository } from '../cards/cards.repository.js';
import { ProfilesRepository } from '../profiles/profiles.repository.js';
import { User } from '../users/entities/user.entity.js';
import { toUserResponse, UserResponse } from '../users/users.mapper.js';
import { UsersRepository } from '../users/users.repository.js';
import { SignInDto } from './dto/sign-in.dto.js';
import { SignUpDto } from './dto/sign-up.dto.js';

const BCRYPT_ROUNDS = 10;

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly profiles: ProfilesRepository,
    private readonly cards: CardsRepository,
    private readonly jwt: JwtService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    const email = normalizeEmail(dto.email);
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('An account with this email already exists.');
    }
    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    const user = await this.dataSource.transaction(async (manager) => {
      const created = await this.users.create({ name: dto.name.trim(), email, passwordHash }, manager);
      await this.profiles.createEmpty(created.id, manager);
      await this.cards.claimByEmail(email, created.id, manager);
      return created;
    });
    return this.issue(user);
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const user = await this.users.findByEmailWithPassword(normalizeEmail(dto.email));
    const valid = user ? await bcrypt.compare(dto.password, user.passwordHash) : false;
    if (!user || !valid) throw new UnauthorizedException('Incorrect email or password.');
    return this.issue(user);
  }

  private async issue(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = { sub: user.id, role: user.role };
    return { token: await this.jwt.signAsync(payload), user: toUserResponse(user) };
  }
}
