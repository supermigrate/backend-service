import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  token_name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  token_symbol: string;

  @IsNotEmpty()
  @IsString()
  token_decimals: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  @Transform(({ value }) => value.trim())
  token_address: string;

  @IsNotEmpty()
  @IsString()
  token_total_supply: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLowerCase())
  create_token_page: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  warpcast_channel_link: string;

  @IsOptional()
  @IsUrl({
    require_protocol: true,
  })
  website_url: string;

  @IsNotEmpty()
  @IsString()
  chain: string;
}

export class ChainDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEthereumAddress()
  deployer_address: string;

  @IsString()
  @IsOptional()
  transaction_hash: string;
}
