import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../common/responses';

export class AuthData {
  @ApiProperty()
  token: string;

  @ApiProperty()
  expire: number;

  @ApiProperty({
    type: User,
  })
  user: User;
}

export class AuthSuccessResponse {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: AuthData,
  })
  data: AuthData;
}

export class UserSessionResponse {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty({
    type: User,
  })
  data: User;
}
