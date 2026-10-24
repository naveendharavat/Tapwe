import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'business_name', type: 'varchar', length: 120, nullable: true })
  businessName: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
