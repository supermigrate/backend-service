import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubAuthDto } from './dtos/auth.dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorResponse } from '../../common/responses';
import { AuthSuccessResponse, UserSessionResponse } from './responses/auth';
import { AuthRequest } from '../../common/interfaces/request.interface';
import { AuthGuard } from '../../common/guards/auth.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authenticated successfully',
    type: AuthSuccessResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid authentication code',
    type: ErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @Post('github')
  async github(@Req() req: Request, @Body() body: GithubAuthDto) {
    const ip = req.clientIp as string;
    return this.authService.github(body.code, ip);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Auth session',
    type: UserSessionResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
    type: ErrorResponse,
  })
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('session')
  async getSession(@Req() request: AuthRequest) {
    return this.authService.getSession(request.user.id);
  }
}
