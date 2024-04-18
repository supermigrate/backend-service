import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chain, PullRequest } from '../interfaces/migration.interface';

@Entity({
  name: 'migrations',
})
export class Migration {
  @ObjectIdColumn()
  id: ObjectId;

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
  status: 'pending' | 'completed' | 'failed';

  @Column()
  metadata: Record<string, any>;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
