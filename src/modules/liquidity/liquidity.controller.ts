import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LiquidityService } from './liquidity.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ErrorResponse } from '../../common/responses';
import { AuthRequest } from '../../common/interfaces/request.interface';
import { CreateDto } from './dtos/liquidity.dto';
import { LiquiditiesResponse, LiquidityResponse } from './responses/liquidity';

@ApiTags('Liquidities')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('liquidities')
export class LiquidityController {
  constructor(private readonly liquidityService: LiquidityService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Liquidity creation successful',
    type: LiquidityResponse,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error recording liquidity',
    type: ErrorResponse,
  })
  @Post()
  async create(@Req() req: AuthRequest, @Body() body: CreateDto) {
    return this.liquidityService.create(req.user, body);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liquidities fetched',
    type: LiquiditiesResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error getting all liquidities',
    type: ErrorResponse,
  })
  @Get()
  async getAll(@Req() req: AuthRequest) {
    return this.liquidityService.getAll(req.user);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liquidity fetched',
    type: LiquidityResponse,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Liquidity not found',
    type: ErrorResponse,
  })
  @Get(':id')
  async getOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.liquidityService.getOne(req.user, id);
  }
}
