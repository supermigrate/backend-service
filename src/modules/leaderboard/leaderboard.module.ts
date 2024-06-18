import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/action.entity';
import { Incentive } from './entities/incentive.entity';
import { Leaderboard } from './entities/leaderboard.entity';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    Incentive, Leaderboard, Action
  ])],
  exports: [LeaderboardService],
  providers: [LeaderboardService],
  controllers: [LeaderboardController],
})
export class EarnModule implements OnModuleInit {
  constructor() { }
  onModuleInit() {
    throw new Error('Method not implemented.');
  }

  // async onModuleInit() { }
}
