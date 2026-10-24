import { PartialType } from '@nestjs/mapped-types';
import { ProvisionCardDto } from './provision-card.dto.js';

export class UpdateCardDto extends PartialType(ProvisionCardDto) {}
