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
import { v4 as uuidv4 } from 'uuid';
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
  block_number: number;

  @Column()
  token_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity({
  name: 'launchbox_token_transactions',
})
export class LaunchboxTokenTransaction {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  address: string;

  @Column()
  token_value: string;

  @Column()
  eth_value: string;

  @Column()
  fee: string;

  @Column()
  type: string;

  @Column()
  transaction_hash: string;

  @Column()
  block_number: number;

  @Column()
  token_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


@Entity({
  name: "launchbox_token_leaderboard"
})
export class LaunchboxTokenLeaderboard {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  token_id: string;

  @Column()
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column((type) => TokenConfiguredAction)
  incentives: TokenConfiguredAction[]


  @Column((type) => LeaderboardParticipant)
  participants: LeaderboardParticipant[]
}

@Entity({
  name: "launchbox_token_leaderboard_actions"
})
export class TokenConfiguredAction {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  action_id: string;

  @Column()
  points: number;

  @Column()
  is_active: boolean


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


@Entity({
  name: "launchbox_incentive_channels"
})
export class IncentiveChannel {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;


  @Column()
  name: string;


  @Column()
  info: string;

  @Column()
  slug: string;


  @Column((type) => IncentiveAction)
  actions: IncentiveAction[]
}


@Entity({
  name: "launchbox_incentive_actions"
})
export class IncentiveAction {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  channel_id: string

  @Column()
  slug: string

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


@Entity({
  name: "launchbox_token_leaderboard_participant"
})
export class LeaderboardParticipant {
  @Exclude()
  @ObjectIdColumn({ select: false })
  _id: ObjectId;

  @PrimaryColumn()
  id: string;

  @Column()
  associated_address: string;

  @Column()
  leaderboard_id: string;

  @Column()
  farcaster_username: string

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  completed_actions: string[]


  constructor(leaderboard_id: string, username: string, address: string) {
    this.id = uuidv4()
    this.leaderboard_id = leaderboard_id
    this.farcaster_username = username
    this.associated_address = address
  }
}
