import {
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Provider } from '../enums/liquidity.enum';
import { Type } from 'class-transformer';

class LiquidityChainDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;
}
export class CreateDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  pool_token_a_address: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  pool_token_b_address: string;

  @IsNotEmpty()
  @IsString()
  pool_token_a_amount: string;

  @IsNotEmpty()
  @IsString()
  pool_token_b_amount: string;

  @IsNotEmpty()
  @IsString()
  pool_token_amount: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  pool_token_address: string;

  @IsNotEmpty()
  @IsString()
  transaction_hash: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  deployer_address: string;

  @IsNotEmpty()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => LiquidityChainDto)
  chain: LiquidityChainDto;

  @IsNotEmpty()
  @IsEnum(Provider)
  provider: Provider;
}
