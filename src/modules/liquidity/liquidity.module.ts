import { Module } from '@nestjs/common';
import { LiquidityService } from './liquidity.service';
import { LiquidityController } from './liquidity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Liquidity } from './entities/liquidity.entity';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Liquidity, User]), JwtModule],
  providers: [LiquidityService],
  controllers: [LiquidityController],
  exports: [LiquidityService],
})
export class LiquidityModule {}
