import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from '../../cards/entities/card.entity.js';

export const CHANGE_REQUEST_STATUSES = ['open', 'done'] as const;
export type ChangeRequestStatus = (typeof CHANGE_REQUEST_STATUSES)[number];

@Entity('change_requests')
export class ChangeRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'card_code', length: 6 })
  cardCode: string;

  @ManyToOne(() => Card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_code' })
  card?: Card;

  @Column({ length: 500 })
  message: string;

  @Column({ type: 'enum', enum: CHANGE_REQUEST_STATUSES, default: 'open' })
  status: ChangeRequestStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
