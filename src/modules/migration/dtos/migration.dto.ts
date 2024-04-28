import {
  IsEthereumAddress,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class MigrateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsNotEmpty()
  @IsString()
  decimals: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  website: string;

  @IsOptional()
  @IsUrl()
  twitter: string;

  @IsNotEmpty()
  @IsString()
  chains: string;
}

class ChainTokenDetail {
  @IsOptional()
  @IsString({ message: 'Token name override must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Token symbol override must be a string' })
  symbol: string;

  @IsOptional()
  @IsNumber({}, { message: 'Token decimals override must be a string' })
  decimals: number;
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
  token_address: string;

  @IsOptional()
  @IsEthereumAddress()
  deployer_address: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  token_detail_override: ChainTokenDetail;

  @IsString()
  @IsOptional()
  transaction_hash: string;
}
