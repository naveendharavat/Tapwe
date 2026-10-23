import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { CardsRepository } from '../cards/cards.repository.js';
import { ProfilesRepository } from '../profiles/profiles.repository.js';
import { User } from '../users/entities/user.entity.js';
import { UsersRepository } from '../users/users.repository.js';
import { AuthService } from './auth.service.js';

function makeService(existing: (User & { passwordHash: string }) | null = null) {
  const users = {
    findByEmail: vi.fn().mockResolvedValue(existing),
    findByEmailWithPassword: vi.fn().mockResolvedValue(existing),
    create: vi.fn().mockImplementation(async (data: Partial<User>) => ({ id: 7, role: 'owner', ...data })),
  };
  const profiles = { createEmpty: vi.fn().mockResolvedValue(undefined) };
  const cards = { claimByEmail: vi.fn().mockResolvedValue(0) };
  const jwt = { signAsync: vi.fn().mockResolvedValue('signed-token') };
  const dataSource = { transaction: vi.fn((work: (manager: object) => unknown) => work({})) };
  const service = new AuthService(
    users as unknown as UsersRepository,
    profiles as unknown as ProfilesRepository,
    cards as unknown as CardsRepository,
    jwt as unknown as JwtService,
    dataSource as unknown as DataSource,
  );
  return { service, users, profiles, cards };
}

describe('AuthService.signUp', () => {
  it('stores a bcrypt hash, never the plain password', async () => {
    const { service, users } = makeService();
    await service.signUp({ name: 'Asha', email: 'asha@cafe.in', password: 'secret123' });
    const stored = users.create.mock.calls[0][0].passwordHash as string;
    expect(stored).not.toBe('secret123');
    expect(await bcrypt.compare('secret123', stored)).toBe(true);
  });

  it('rejects an email that already has an account', async () => {
    const { service } = makeService({ id: 1 } as User & { passwordHash: string });
    await expect(
      service.signUp({ name: 'Asha', email: 'asha@cafe.in', password: 'secret123' }),
    ).rejects.toThrow(new ConflictException('An account with this email already exists.'));
  });

  it('claims cards provisioned for the normalized email and creates an empty profile', async () => {
    const { service, cards, profiles } = makeService();
    await service.signUp({ name: 'Asha', email: ' Owner@X.com ', password: 'secret123' });
    expect(cards.claimByEmail).toHaveBeenCalledWith('owner@x.com', 7, expect.anything());
    expect(profiles.createEmpty).toHaveBeenCalledWith(7, expect.anything());
  });

  it('returns a token and the public user shape', async () => {
    const { service } = makeService();
    const result = await service.signUp({ name: 'Asha', email: 'asha@cafe.in', password: 'secret123' });
    expect(result).toEqual({
      token: 'signed-token',
      user: { id: 7, name: 'Asha', email: 'asha@cafe.in', role: 'owner' },
    });
  });
});

describe('AuthService.signIn', () => {
  it('rejects a wrong password', async () => {
    const passwordHash = await bcrypt.hash('right-password', 4);
    const { service } = makeService({ id: 1, name: 'A', email: 'a@b.in', role: 'owner', passwordHash } as User);
    await expect(service.signIn({ email: 'a@b.in', password: 'wrong-password' })).rejects.toThrow(
      new UnauthorizedException('Incorrect email or password.'),
    );
  });

  it('rejects an unknown email with the same message', async () => {
    const { service } = makeService(null);
    await expect(service.signIn({ email: 'nobody@b.in', password: 'whatever1' })).rejects.toThrow(
      new UnauthorizedException('Incorrect email or password.'),
    );
  });
});
