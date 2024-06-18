import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Leaderboard } from './entities/leaderboard.entity';
import { Participant } from './entities/participant.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderBoardRepo: MongoRepository<Leaderboard>,

    @InjectRepository(Participant)
    private readonly participantRepo: MongoRepository<Participant>
  ) { }

  private logger = new Logger(LeaderboardService.name);


  async activate() { }

  async participate() { }

  async getRank() { }

  async getRanks() { }


  async updateIncentives() { }
}
