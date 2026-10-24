import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

export const CARD_STATUSES = ['draft', 'active', 'paused'] as const;
export type CardStatus = (typeof CARD_STATUSES)[number];

export const DESTINATION_TYPES = ['profile', 'url', 'menu', 'form'] as const;
export type DestinationType = (typeof DESTINATION_TYPES)[number];

@Entity('cards')
export class Card {
  @PrimaryColumn({ length: 6 })
  code: string;

  @Index()
  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId: number | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Index()
  @Column({ name: 'owner_email', type: 'varchar', length: 190, nullable: true })
  ownerEmail: string | null;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'enum', enum: CARD_STATUSES, default: 'draft' })
  status: CardStatus;

  @Column({ name: 'destination_type', type: 'enum', enum: DESTINATION_TYPES, default: 'profile' })
  destinationType: DestinationType;

  @Column({ name: 'destination_url', type: 'varchar', length: 500, nullable: true })
  destinationUrl: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz' })
  deletedAt: Date | null;
}
