import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

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
