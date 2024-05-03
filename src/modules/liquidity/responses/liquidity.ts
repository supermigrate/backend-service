import { ApiProperty } from '@nestjs/swagger';
import { Provider } from '../enums/liquidity.enum';

export class LiquidityChain {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class Liquidity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  pool_token_a_address: string;

  @ApiProperty()
  pool_token_b_address: string;

  @ApiProperty()
  pool_token_a_amount: string;

  @ApiProperty()
  pool_token_b_amount: string;

  @ApiProperty()
  pool_token_amount: string;

  @ApiProperty()
  pool_token_address: string;

  @ApiProperty()
  transaction_hash: string;

  @ApiProperty()
  deployer_address: string;

  @ApiProperty({ type: LiquidityChain })
  chain: LiquidityChain;

  @ApiProperty({ enum: Provider })
  provider: Provider;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class LiquidityResponse {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: Liquidity,
  })
  data: Liquidity;
}

export class LiquiditiesResponse {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: [Liquidity],
  })
  data: Liquidity[];
}
