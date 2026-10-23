import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HTTP_URL_MESSAGE } from '../../common/validators/is-http-url.validator.js';
import { AppConfig } from '../../config/configuration.js';
import { ProfilesRepository } from '../profiles/profiles.repository.js';
import { UsersRepository } from '../users/users.repository.js';
import { CardChanges, CardsRepository } from './cards.repository.js';
import { CardResponse, toCardResponse } from './cards.mapper.js';
import { ProvisionCardDto } from './dto/provision-card.dto.js';
import { UpdateCardDto } from './dto/update-card.dto.js';
import { Card, DestinationType } from './entities/card.entity.js';

export const CARD_CODE_GENERATOR = Symbol('CARD_CODE_GENERATOR');
const MAX_CODE_ATTEMPTS = 5;

@Injectable()
export class CardsService {
  constructor(
    private readonly cards: CardsRepository,
    private readonly users: UsersRepository,
    private readonly profiles: ProfilesRepository,
    private readonly config: ConfigService<AppConfig, true>,
    @Inject(CARD_CODE_GENERATOR) private readonly generateCode: () => string,
  ) {}

  async listForOwner(userId: number): Promise<CardResponse[]> {
    const [cards, profile] = await Promise.all([
      this.cards.findAllForUser(userId),
      this.profiles.findByUserId(userId),
    ]);
    return cards.map((card) => this.toResponse(card, profile?.businessName ?? null));
  }

  async getForOwner(code: string, userId: number): Promise<CardResponse> {
    const card = await this.findOwnedOrFail(code, userId);
    const profile = await this.profiles.findByUserId(userId);
    return this.toResponse(card, profile?.businessName ?? null);
  }

  async deleteForOwner(code: string, userId: number): Promise<void> {
    await this.findOwnedOrFail(code, userId);
    await this.cards.softDelete(code);
  }

  /** Owners only ever see their own cards; anything else is indistinguishable from "missing". */
  async findOwnedOrFail(code: string, userId: number): Promise<Card> {
    const card = await this.cards.findOwned(code, userId);
    if (!card) throw new NotFoundException('Card not found.');
    return card;
  }

  async provision(dto: ProvisionCardDto): Promise<Card> {
    const destinationUrl = this.resolveDestinationUrl(dto.destinationType, dto.destinationUrl);
    const ownerEmail = dto.ownerEmail ?? null;
    const owner = ownerEmail ? await this.users.findByEmail(ownerEmail) : null;
    return this.cards.create({
      code: await this.uniqueCode(),
      name: dto.name,
      ownerEmail,
      userId: owner?.id ?? null,
      status: dto.status ?? 'draft',
      destinationType: dto.destinationType,
      destinationUrl,
    });
  }

  async update(code: string, dto: UpdateCardDto): Promise<Card> {
    const card = await this.cards.findByCode(code);
    if (!card) throw new NotFoundException('Card not found.');

    const destinationType = dto.destinationType ?? card.destinationType;
    const changes: CardChanges = {
      name: dto.name,
      status: dto.status,
      destinationType: dto.destinationType,
      destinationUrl: this.resolveDestinationUrl(
        destinationType,
        dto.destinationUrl !== undefined ? dto.destinationUrl : card.destinationUrl,
      ),
    };
    if (dto.ownerEmail !== undefined) {
      const owner = dto.ownerEmail ? await this.users.findByEmail(dto.ownerEmail) : null;
      changes.ownerEmail = dto.ownerEmail;
      changes.userId = owner?.id ?? null;
    }
    await this.cards.update(code, changes);
    return (await this.cards.findByCode(code))!;
  }

  private resolveDestinationUrl(type: DestinationType, url: string | null | undefined): string | null {
    if (type === 'profile') return null;
    if (!url) throw new BadRequestException(HTTP_URL_MESSAGE);
    return url;
  }

  private async uniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const code = this.generateCode();
      if (!(await this.cards.codeExists(code))) return code;
    }
    throw new Error('Could not generate a unique card code.');
  }

  private toResponse(card: Card, businessName: string | null): CardResponse {
    return toCardResponse(card, this.config.get('publicCardBaseUrl', { infer: true }), businessName);
  }
}
