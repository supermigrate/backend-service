import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'typeorm';

export class ErrorResponse {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;
}

export class User {
  @ApiProperty()
  id: string | ObjectId;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  avatar_url: string;

  @ApiProperty()
  ip_address: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
