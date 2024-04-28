import { ApiProperty } from '@nestjs/swagger';
import { PrStatus, Status } from '../enums/migration.enum';

export class ChainTokenOverride {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  symbol?: string;

  @ApiProperty()
  decimals?: number;
}
export class Chain {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  token_address: string;

  @ApiProperty({ type: ChainTokenOverride })
  token_detail_override?: ChainTokenOverride;

  @ApiProperty()
  transaction_hash?: string;
}

export class PullRequest {
  @ApiProperty()
  id: number;

  @ApiProperty()
  installation_id: number;

  @ApiProperty()
  url: string;

  @ApiProperty({ type: PrStatus, enum: PrStatus, enumName: 'PrStatus' })
  status: PrStatus;
}

export class Migration {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  decimals: number;

  @ApiProperty()
  logo_url: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  website: string;

  @ApiProperty()
  twitter: string;

  @ApiProperty({ type: Chain })
  chains: Chain[];

  @ApiProperty({ type: PullRequest })
  pull_requests: PullRequest[];

  @ApiProperty({ type: Status, enum: Status, enumName: 'Status' })
  status: Status;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class MigrationResponse {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: Migration,
  })
  data: Migration;
}

export class MigrationsResponse {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: [Migration],
  })
  data: Migration[];
}
