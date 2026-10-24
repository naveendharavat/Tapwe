import { Card, CardStatus, DestinationType } from './entities/card.entity.js';

export interface CardResponse {
  code: string;
  name: string;
  status: CardStatus;
  destinationType: DestinationType;
  destinationUrl: string | null;
  destinationLabel: string;
  url: string;
  createdAt: Date;
}

export function cardUrl(baseUrl: string, code: string): string {
  return `${baseUrl.replace(/\/$/, '')}/c/${code}`;
}

export function toCardResponse(card: Card, baseUrl: string, businessName: string | null): CardResponse {
  const destinationLabel =
    card.destinationType === 'profile'
      ? businessName
        ? `Profile: ${businessName}`
        : 'Digital profile'
      : (card.destinationUrl ?? 'Not set yet');
  return {
    code: card.code,
    name: card.name,
    status: card.status,
    destinationType: card.destinationType,
    destinationUrl: card.destinationUrl,
    destinationLabel,
    url: cardUrl(baseUrl, card.code),
    createdAt: card.createdAt,
  };
}
