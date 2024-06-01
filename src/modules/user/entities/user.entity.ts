import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GithubAuth } from '../interfaces/user.interface';

@Entity({
  name: 'users',
})
export class User {
  @ObjectIdColumn({ select: false })
  @Exclude()
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Exclude()
  @Column({ unique: true, select: false })
  github_id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  avatar_url: string;

  @Column()
  ip_address: string;

  @Column({ default: 0 })
  points_balance: number;

  @Column()
  referral_code: string;

  @Column()
  connected_addressess: string[];

  @Exclude()
  @Column({ select: false })
  github_auth: GithubAuth;

  @Exclude()
  @Column({ select: false })
  metadata: Record<string, any>;

  rank: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
