import { CardsRepository } from './cards.repository.js';
import { CardsService } from './cards.service.js';
import { ProfilesRepository } from '../profiles/profiles.repository.js';
import { UsersRepository } from '../users/users.repository.js';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration.js';

describe('CardsService.provision', () => {
  it('retries with a new code when the generated one is taken', async () => {
    const cards = {
      codeExists: vi.fn().mockResolvedValueOnce(true).mockResolvedValueOnce(false),
      create: vi.fn().mockImplementation(async (data: object) => data),
    };
    const users = { findByEmail: vi.fn().mockResolvedValue(null) };
    const codes = ['taken1', 'fresh2'];
    const service = new CardsService(
      cards as unknown as CardsRepository,
      users as unknown as UsersRepository,
      {} as ProfilesRepository,
      { get: () => 'http://localhost:5173' } as unknown as ConfigService<AppConfig, true>,
      () => codes.shift()!,
    );

    const card = await service.provision({ name: 'Front desk', destinationType: 'profile' });

    expect(cards.codeExists).toHaveBeenCalledTimes(2);
    expect(card.code).toBe('fresh2');
  });
});
