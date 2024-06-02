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
import { ActivitySlug } from '../enums/earn.enum';
import { Multiplier } from './multiplier.entity';

@Entity({
  name: 'activities',
})
export class Activity {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  slug: ActivitySlug;

  @Column()
  description: string;

  @Column()
  points_value: number;

  @Column({ default: false })
  is_percentage_based: boolean;

  @Column({ default: 0 })
  percentage_value: number;

  @Column()
  is_active: boolean;

  multipliers: Multiplier[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
