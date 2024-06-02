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
import {
  ActivitySlug,
  TransactionStatus,
  TransactionType,
} from '../enums/earn.enum';

@Entity({
  name: 'points_transactions',
})
export class Transaction {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  points: number;

  @Column()
  user_id: string;

  @Column()
  activity_id: string;

  @Column()
  activity_slug: ActivitySlug;

  @Column()
  type: TransactionType;

  @Column()
  status: TransactionStatus;

  totalPoints: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
