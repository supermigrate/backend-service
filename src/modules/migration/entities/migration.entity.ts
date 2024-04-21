import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chain, PullRequest } from '../interfaces/migration.interface';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'migrations',
})
export class Migration {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  decimals: number;

  @Column()
  logo_url: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  website: string;

  @Column({ default: null })
  twitter: string;

  @Column()
  chains: Chain[];

  @Column()
  pull_requests: PullRequest[];

  @Column()
  status: 'pending' | 'completed' | 'failed' | 'processing';

  @Exclude()
  @Column({ select: false })
  metadata: Record<string, any> | null;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
