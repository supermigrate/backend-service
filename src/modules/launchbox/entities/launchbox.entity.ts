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
import { Chain, Social } from '../interfaces/launchbox.interface';

@Entity({
  name: 'launchbox_tokens',
})
export class LaunchboxToken {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  token_name: string;

  @Column()
  token_symbol: string;

  @Column()
  token_decimals: number;

  @Column()
  token_address: string;

  @Column()
  exchange_address: string;

  @Column()
  token_total_supply: number;

  @Column()
  token_logo_url: string;

  @Column()
  create_token_page: boolean;

  @Column()
  warpcast_channel_link: string;

  @Column()
  website_url: string;

  @Column()
  chain: Chain;

  @Column()
  socials: Social;

  @Column()
  is_active: boolean;

  @Column()
  configurations: {
    [key: string]: any;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity({
  name: 'launchbox_token_holders',
})
export class LaunchboxTokenHolder {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  address: string;

  @Column()
  balance: string;

  @Column()
  token_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
