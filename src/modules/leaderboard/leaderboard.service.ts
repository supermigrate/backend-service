import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceError } from 'src/common/errors/service.error';
import { IResponse } from 'src/common/interfaces/response.interface';
import { successResponse } from 'src/common/responses/success.helper';
import { MongoRepository } from 'typeorm';
import { LaunchboxToken } from '../launchbox/entities/launchbox.entity';
import { PaginateDto, RankInitDto } from './dtos/rank.dto';
import { Incentive } from './entities/incentive.entity';
import { Leaderboard } from './entities/leaderboard.entity';
import { Participant } from './entities/participant.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(Leaderboard)
    private readonly leaderBoardRepo: MongoRepository<Leaderboard>,

    @InjectRepository(Participant)
    private readonly participantRepo: MongoRepository<Participant>,

    @InjectRepository(LaunchboxToken)
    private readonly launchboxTokenRepository: MongoRepository<LaunchboxToken>,

    @InjectRepository(Incentive)
    private readonly incentiveRepository: MongoRepository<Incentive>
  ) { }

  private logger = new Logger(LeaderboardService.name);

  async activate(body: RankInitDto): Promise<IResponse | ServiceError> {
    try {
      const { token_address, incentives } = body

      const launchbox = await this.launchboxTokenRepository.findOne({
        where: { token_address },
      });

      if (!launchbox) {
        throw new ServiceError('Token not found', HttpStatus.NOT_FOUND);
      }


      // find incentives
      const IDs = incentives.flatMap((ict, idx) => ict.id)
      const activeIncentives = await this.incentiveRepository.findBy({
        where: {
          id: {
            $in: [...IDs]
          }
        }
      })

      const leaderbox = this.leaderBoardRepo.create({
        incentives: activeIncentives,

      })

      await this.leaderBoardRepo.save(leaderbox)

      const ranking = await this.leaderBoardRepo.findOne({
        where: {
          id: leaderbox.id
        }
      })


      return successResponse({
        status: true,
        message: "incentives active",
        data: ranking
      })

    } catch (error) {
      this.logger.error('An error occurred while fetching the token.', error);

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while fetching the token. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async participate(userAddress: string, tokenAddress: string): Promise<IResponse | ServiceError> {

    try {

      return successResponse({
        status: true,
        message: "",
      })
    } catch (error) {
      throw new ServiceError(
        'An error occurred while fetching the token. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }

  }

  async getRank(userAddress: string): Promise<IResponse | ServiceError> {
    try {

      return successResponse({
        status: true,
        message: "",
      })
    } catch (error) {
      throw new ServiceError(
        'An error occurred while fetching the token. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async getRanks(tokenAddress: string): Promise<IResponse | ServiceError> {

    try {

      return successResponse({
        status: true,
        message: "",
      })
    } catch (error) {
      throw new ServiceError(
        'An error occurred while fetching the token. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async getIncentives(query: PaginateDto, tokenAddress: string): Promise<IResponse | ServiceError> {
    try {

      return successResponse({
        status: true,
        message: "",
      })
    } catch (error) {
      throw new ServiceError(
        'An error occurred while fetching the token. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async updateIncentives(): Promise<IResponse | ServiceError> {

    try {

      return successResponse({
        status: true,
        message: "",
      })
    } catch (error) {
      throw new ServiceError(
        'An error occurred while fetching the token. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }
}
