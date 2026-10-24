import { TapEvent } from '../modules/analytics/entities/tap-event.entity.js';
import { CardRequest } from '../modules/card-requests/entities/card-request.entity.js';
import { Card } from '../modules/cards/entities/card.entity.js';
import { ChangeRequest } from '../modules/change-requests/entities/change-request.entity.js';
import { Profile } from '../modules/profiles/entities/profile.entity.js';
import { User } from '../modules/users/entities/user.entity.js';

export const entities = [User, Profile, Card, CardRequest, ChangeRequest, TapEvent];
