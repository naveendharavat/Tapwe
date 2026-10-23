import { Injectable, NotFoundException } from '@nestjs/common';
import { TapEventsRepository } from '../analytics/tap-events.repository.js';
import { CardsRepository } from '../cards/cards.repository.js';
import { ProfileResponse, toProfileResponse } from '../profiles/profiles.mapper.js';
import { ProfilesRepository } from '../profiles/profiles.repository.js';

export type PublicCardResponse =
  | { state: 'redirect'; url: string }
  | { state: 'profile'; profile: ProfileResponse }
  | { state: 'inactive' };

@Injectable()
export class PublicService {
  constructor(
    private readonly cards: CardsRepository,
    private readonly profiles: ProfilesRepository,
    private readonly taps: TapEventsRepository,
  ) {}

  /** What a tap or scan of this card should open. Only resolvable cards count as a tap. */
  async resolve(code: string, userAgent: string | null): Promise<PublicCardResponse> {
    const card = await this.cards.findByCode(code);
    if (!card) throw new NotFoundException('Card not found.');
    if (card.status !== 'active' || !card.userId) return { state: 'inactive' };

    let response: PublicCardResponse;
    if (card.destinationType === 'profile') {
      response = { state: 'profile', profile: toProfileResponse(await this.profiles.findByUserId(card.userId)) };
    } else if (card.destinationUrl) {
      response = { state: 'redirect', url: card.destinationUrl };
    } else {
      return { state: 'inactive' };
    }

    await this.taps.record(card.code, userAgent);
    return response;
  }
}
