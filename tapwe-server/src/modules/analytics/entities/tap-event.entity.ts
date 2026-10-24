import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Card } from '../../cards/entities/card.entity.js';

@Entity('tap_events')
@Index(['cardCode', 'happenedAt'])
export class TapEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'card_code', length: 6 })
  cardCode: string;

  @ManyToOne(() => Card, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_code' })
  card?: Card;

  @CreateDateColumn({ name: 'happened_at', type: 'timestamptz' })
  happenedAt: Date;

  @Column({ name: 'user_agent', type: 'varchar', length: 300, nullable: true })
  userAgent: string | null;
}
