import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Provider } from '../enums/liquidity.enum';
import { Chain } from '../interfaces/liquidity.interface';

@Entity({
  name: 'liquidities',
})
export class Liquidity {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  pool_token_a_address: string;

  @Column()
  pool_token_b_address: string;

  @Column()
  pool_token_a_amount: string;

  @Column()
  pool_token_b_amount: string;

  @Column()
  pool_token_amount: string;

  @Column()
  pool_token_address: string;

  @Column()
  transaction_hash: string;

  @Column()
  deployer_address: string;

  @Column()
  chain: Chain;

  @Column()
  provider: Provider;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
