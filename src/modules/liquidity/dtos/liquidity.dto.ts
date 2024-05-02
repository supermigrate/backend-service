import {
  IsEnum,
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { Chain } from 'src/modules/migration/responses/migration';
import { Provider } from '../enums/liquidity.enum';

export class Create {
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
  @IsEnum(Chain)
  chain: Chain;

  @IsNotEmpty()
  @IsEnum(Provider)
  provider: Provider;
}
