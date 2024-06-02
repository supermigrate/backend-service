import {
  IsEthereumAddress,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  connected_address: string;

  @IsOptional()
  @IsString()
  referral_code: string;
}
