import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SanitizerGuard } from 'src/common/guards/sanitizer.guard';
import { LeaderboardService } from './leaderboard.service';

@ApiTags('Learderboard')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(SanitizerGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) { }


  @Post("/")
  async activateLeaderBoard() {

  }


  @Get("/:tokenAddress/:user")
  async getScore() {

  }


  @Get("/:tokenAddress")
  async getLeaderBoard() {

  }


}
