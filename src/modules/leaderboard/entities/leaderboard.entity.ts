import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Incentive } from './incentive.entity';

@Entity('leaderboards')
export class Leaderboard {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  user_id: string;

  @Column()
  token_address: string;

  @Column({ unique: true })
  farcaster_channel: string;

  @Column()
  is_active: boolean;

  @Column('json')
  incentives: Incentive[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
