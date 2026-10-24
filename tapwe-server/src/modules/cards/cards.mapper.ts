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

/** What the Tapwe team sees: every card, who it belongs to, and whether that person has signed up yet. */
export interface AdminCardResponse {
  code: string;
  name: string;
  ownerEmail: string | null;
  claimed: boolean;
  status: CardStatus;
  destinationType: DestinationType;
  destinationUrl: string | null;
  url: string;
  createdAt: Date;
  updatedAt: Date;
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

export function toAdminCardResponse(card: Card, baseUrl: string): AdminCardResponse {
  return {
    code: card.code,
    name: card.name,
    ownerEmail: card.ownerEmail,
    claimed: card.userId !== null,
    status: card.status,
    destinationType: card.destinationType,
    destinationUrl: card.destinationUrl,
    url: cardUrl(baseUrl, card.code),
    createdAt: card.createdAt,
    updatedAt: card.updatedAt,
  };
}
