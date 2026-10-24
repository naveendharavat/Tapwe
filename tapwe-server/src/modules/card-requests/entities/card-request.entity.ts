import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const CARD_REQUEST_STATUSES = ['new', 'contacted', 'fulfilled'] as const;
export type CardRequestStatus = (typeof CARD_REQUEST_STATUSES)[number];

@Entity('card_requests')
export class CardRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ name: 'business_name', length: 120 })
  businessName: string;

  @Column({ length: 190 })
  email: string;

  @Column({ length: 10 })
  phone: string;

  @Column({ name: 'business_type', length: 60 })
  businessType: string;

  @Column({ length: 30 })
  quantity: string;

  @Column({ type: 'json' })
  destinations: string[];

  @Column({ type: 'varchar', length: 120, nullable: true })
  city: string | null;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Column({ default: false })
  agreed: boolean;

  @Column({ type: 'enum', enum: CARD_REQUEST_STATUSES, default: 'new' })
  status: CardRequestStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
