import { IsNotEmpty, IsString } from 'class-validator';

export class GithubAuthDto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
