import type { UserRole } from "../auth/auth.types";
import type { CardStatus, DestinationType } from "../cards/cards.types";

export interface AdminCard {
  code: string;
  name: string;
  ownerEmail: string | null;
  claimed: boolean;
  status: CardStatus;
  destinationType: DestinationType;
  destinationUrl: string | null;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardInput {
  name: string;
  ownerEmail: string | null;
  status: CardStatus;
  destinationType: DestinationType;
  destinationUrl: string | null;
}

export interface CardFilter {
  status?: CardStatus;
  search?: string;
}

export type CardRequestStatus = "new" | "contacted" | "fulfilled";

export interface CardRequest {
  id: number;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  quantity: string;
  destinations: string[];
  city: string | null;
  note: string | null;
  agreed: boolean;
  status: CardRequestStatus;
  createdAt: string;
}

export type ChangeRequestStatus = "open" | "done";

export interface ChangeRequest {
  id: number;
  cardCode: string;
  cardName: string | null;
  message: string;
  status: ChangeRequestStatus;
  createdAt: string;
}

export const CARD_REQUEST_STATUS_LABELS: Record<CardRequestStatus, string> = {
  new: "New",
  contacted: "Contacted",
  fulfilled: "Fulfilled",
};

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  businessName: string | null;
  phone: string | null;
  cardCount: number;
  createdAt: string;
}
