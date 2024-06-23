import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LaunchboxToken,
  LaunchboxTokenHolder,
  LaunchboxTokenTransaction,
} from './entities/launchbox.entity';
import {
  ChainDto,
  CreateDto,
  PaginateDto,
  SocialDto,
  UpdateDto,
} from './dtos/launchbox.dto';
import { ServiceError } from '../../common/errors/service.error';
import { CloudinaryService } from '../../common/helpers/cloudinary/cloudinary.service';
import { IResponse } from '../../common/interfaces/response.interface';
import { successResponse } from '../../common/responses/success.helper';
import { Chain } from './interfaces/launchbox.interface';
import { FarcasterService } from '../../common/helpers/farcaster/farcaster.service';
import { env } from '../../common/config/env';
import { ContractService } from '../../common/helpers/contract/contract.service';

@Injectable()
export class LaunchboxService {
  constructor(
    @InjectRepository(LaunchboxToken)
    private readonly launchboxTokenRepository: MongoRepository<LaunchboxToken>,
    @InjectRepository(LaunchboxTokenHolder)
    private readonly launchboxTokenHolderRepository: MongoRepository<LaunchboxTokenHolder>,
    @InjectRepository(LaunchboxTokenTransaction)
    private readonly launchboxTokenTransactionRepository: MongoRepository<LaunchboxTokenTransaction>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly farcasterService: FarcasterService,
    private readonly httpService: HttpService,
    private readonly contractService: ContractService,
  ) {}

  private logger = new Logger(LaunchboxService.name);

  async create(
    body: CreateDto,
    file: Express.Multer.File,
  ): Promise<IResponse | ServiceError> {
    try {
      const formattedChain: Chain = JSON.parse(body.chain);
      this.validateBodyChain(formattedChain);

      let formattedSocials: SocialDto = {} as SocialDto;

      if (body.socials) {
        formattedSocials = JSON.parse(body.socials);
        this.validateBodySocial(formattedSocials);
      }

      const tokenExists = await this.launchboxTokenRepository.findOne({
        where: {
          token_address: body.token_address,
          'chain.id': formattedChain.id,
        },
      });

      if (tokenExists) {
        throw new ServiceError('Token already exists', HttpStatus.BAD_REQUEST);
      }

      const logoUrl = await this.cloudinaryService.upload(file, 'launchboxes');

      if (!logoUrl) {
        throw new ServiceError('Upload failed', HttpStatus.BAD_REQUEST);
      }

      const launchbox = this.launchboxTokenRepository.create({
        ...body,
        id: uuidv4(),
        token_decimals: Number(body.token_decimals),
        token_total_supply: Number(body.token_total_supply),
        create_token_page: body.create_token_page === 'true',
        chain: formattedChain,
        socials: {
          warpcast: { channel: formattedSocials },
        },
        token_logo_url: logoUrl,
        is_active: true,
      });

      await this.launchboxTokenRepository.save(launchbox);

      const token = await this.launchboxTokenRepository.findOne({
        where: {
          id: launchbox.id,
        },
      });

      return successResponse({
        status: true,
        message: 'Token created successfully',
        data: token,
      });
    } catch (error) {
      this.logger.error('An error occurred while creating the token.', error);

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while creating the token. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async updateOne(
    id: string,
    body: UpdateDto,
  ): Promise<IResponse | ServiceError> {
    try {
      const token = await this.launchboxTokenRepository.findOne({
        where: { id },
      });

      if (!token) {
        throw new ServiceError('Token not found', HttpStatus.NOT_FOUND);
      }

      await this.launchboxTokenRepository.updateOne(
        { id },
        {
          $set: {
            socials: {
              warpcast: { channel: body.socials },
            },
          },
        },
      );

      const updatedToken = await this.launchboxTokenRepository.findOne({
        where: { id },
      });

      return successResponse({
        status: true,
        message: 'Token updated successfully',
        data: updatedToken,
      });
    } catch (error) {
      console.log(error);

      this.logger.error('An error occurred while updating the token.', error);

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while updating the token. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async findAll(query: PaginateDto): Promise<IResponse | ServiceError> {
    try {
      const totalTokens = await this.launchboxTokenRepository.count();

      let queryOptions = {};

      if (query.deployer_address) {
        queryOptions = {
          'chain.deployer_address': query.deployer_address,
          is_active: true,
        };
      } else if (query.search) {
        queryOptions = {
          is_active: true,
          $or: [
            {
              token_name: { $regex: query.search, $options: 'i' },
            },
            {
              token_symbol: { $regex: query.search, $options: 'i' },
            },
            {
              token_address: { $regex: query.search, $options: 'i' },
            },
          ],
        };
      } else {
        queryOptions = {
          is_active: true,
        };
      }

      const launchboxTokens = await this.launchboxTokenRepository.find({
        where: queryOptions,
        skip: Number(query.skip),
        take: Number(query.take),
        order: {
          created_at: 'DESC',
        },
      });

      return successResponse({
        status: true,
        message: 'Tokens fetched successfully',
        data: launchboxTokens,
        meta: {
          take: Number(query.take),
          skip: Number(query.skip),
          totalCount: totalTokens,
        },
      });
    } catch (error) {
      this.logger.error(
        'An error occurred while fetching the tokens.',
        error.stack,
      );

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while fetching the tokens. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async findOne(reference: string): Promise<IResponse | ServiceError> {
    try {
      const isUuid = validator.isUUID(reference);
      const launchbox = await this.launchboxTokenRepository.findOne({
        where: isUuid ? { id: reference } : { token_address: reference },
      });

      if (!launchbox) {
        throw new ServiceError('Token not found', HttpStatus.NOT_FOUND);
      }

      return successResponse({
        status: true,
        message: 'Token fetched successfully',
        data: launchbox,
      });
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

  async getTokenHolders(
    query: PaginateDto,
    id: string,
  ): Promise<IResponse | ServiceError> {
    try {
      const token = await this.launchboxTokenRepository.findOne({
        where: { id },
      });

      if (!token) {
        throw new ServiceError('Token not found', HttpStatus.NOT_FOUND);
      }

      const holdersCount = await this.launchboxTokenHolderRepository.count({
        where: {
          token_id: id,
        },
      });

      const holders = await this.launchboxTokenHolderRepository.find({
        where: {
          token_id: id,
          skip: Number(query.skip),
          take: Number(query.take),
        },
      });

      return successResponse({
        status: true,
        message: 'Token holders fetched successfully',
        data: holders,
        meta: {
          take: Number(query.take),
          skip: Number(query.skip),
          totalCount: holdersCount,
        },
      });
    } catch (error) {
      this.logger.error(
        'An error occurred while fetching the token holders.',
        error.stack,
      );

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while fetching the token holders. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async getTokenCasts(id: string): Promise<IResponse | ServiceError> {
    try {
      const token = await this.launchboxTokenRepository.findOne({
        where: { id },
      });

      if (!token) {
        throw new ServiceError('Token not found', HttpStatus.NOT_FOUND);
      } else if (!token.socials?.warpcast?.channel?.url) {
        throw new ServiceError(
          'Token does not have a connected channel',
          HttpStatus.BAD_REQUEST,
        );
      }

      const casts = await this.farcasterService.getChannelCasts(
        token.socials.warpcast.channel.url,
      );

      return successResponse({
        status: true,
        message: 'Token casts fetched successfully',
        data: casts,
      });
    } catch (error) {
      this.logger.error(
        'An error occurred while fetching the token casts.',
        error.stack,
      );

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while fetching the token casts. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async getTokenTransactions(
    query: PaginateDto,
    id: string,
  ): Promise<IResponse | ServiceError> {
    try {
      const token = await this.launchboxTokenRepository.findOne({
        where: { id },
      });

      if (!token) {
        throw new ServiceError('Token not found', HttpStatus.NOT_FOUND);
      }

      const transactionsCount =
        await this.launchboxTokenTransactionRepository.count({
          where: {
            token_id: id,
          },
        });

      const transactions = await this.launchboxTokenTransactionRepository.find({
        where: {
          token_id: id,
          skip: Number(query.skip),
          take: Number(query.take),
        },
      });

      return successResponse({
        status: true,
        message: 'Token transactions fetched successfully',
        data: transactions,
        meta: {
          take: Number(query.take),
          skip: Number(query.skip),
          totalCount: transactionsCount,
        },
      });
    } catch (error) {
      this.logger.error(
        'An error occurred while fetching the token transactions.',
        error.stack,
      );

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while fetching the token transactions. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async getChannelsByAddress(
    address: string,
  ): Promise<IResponse | ServiceError> {
    try {
      const channels =
        await this.farcasterService.getChannelsByAddress(address);

      const formattedChannels = channels.map((channel) => {
        return {
          name: channel.name,
          description: channel.description,
          channel_id: channel.channelId,
          image_url: channel.imageUrl,
          lead_ids: channel.leadIds,
          dapp_name: channel.dappName,
          url: channel.url,
          follower_count: channel.followerCount,
          created_at: channel.createdAtTimestamp,
        };
      });

      return successResponse({
        status: true,
        message: 'farcast channels fetched successfully',
        data: formattedChannels,
      });
    } catch (error) {
      this.logger.error(
        'An error occurred while fetching the channels.',
        error,
      );

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while fetching the channels. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async getCoinPrice({
    coin,
    currency,
  }: {
    coin: string;
    currency: string;
  }): Promise<IResponse | ServiceError> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${env.coingecko.url}/coins/markets?vs_currency=${currency}&ids=${coin}`,
      );

      return successResponse({
        status: true,
        message: 'Get current coin price',
        data: {
          name: response.data[0].name,
          symbol: response.data[0].symbol,
          price: response.data[0].current_price,
          currency,
          last_updated: response.data[0].last_updated,
        },
      });
    } catch (error) {
      this.logger.error('An error occurred while fetching the price.', error);

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while fetching the price. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async seedTokenHolders(): Promise<IResponse | ServiceError> {
    try {
      const tokens = await this.launchboxTokenRepository.find();

      for (const token of tokens) {
        const tokenHolder = await this.launchboxTokenHolderRepository.findOne({
          where: {
            token_id: token.id,
          },
          order: {
            block_number: 'DESC',
          },
        });

        const holders = await this.contractService.getTokenHolders(
          token.token_address,
          tokenHolder?.block_number ?? token.chain.block_number ?? 0,
        );

        if (!holders) {
          continue;
        }

        const holderEntries = Object.entries(holders);

        for (const [address, { balance, blockNumber }] of holderEntries) {
          if (balance.eq(0)) {
            await this.launchboxTokenHolderRepository.deleteOne({
              where: { address, token_id: token.id },
            });
          } else {
            const holder = await this.launchboxTokenHolderRepository.findOne({
              where: { address, token_id: token.id },
            });

            if (holder) {
              await this.launchboxTokenHolderRepository.updateOne(
                { token_id: token.id, address },
                {
                  $set: {
                    balance: balance.toString(),
                  },
                },
              );
            } else {
              const newHolder = this.launchboxTokenHolderRepository.create({
                id: uuidv4(),
                balance: balance.toString(),
                address,
                block_number: blockNumber,
                token_id: token.id,
              });

              await this.launchboxTokenHolderRepository.save(newHolder);
            }
          }
        }
      }

      return successResponse({
        status: true,
        message: 'Tokens holders seeded successfully',
      });
    } catch (error) {
      this.logger.error(
        'An error occurred while seeding the token holders.',
        error,
      );

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while seeding the token holders. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async seedTokenTransactions(): Promise<IResponse | ServiceError> {
    try {
      const tokens = await this.launchboxTokenRepository.find();

      for (const token of tokens) {
        const tokenTransactions =
          await this.launchboxTokenTransactionRepository.findOne({
            where: {
              token_id: token.id,
            },
            order: {
              block_number: 'DESC',
            },
          });

        const transactions = await this.contractService.getTokenTransactions(
          token.token_address,
          tokenTransactions?.block_number ?? token.chain.block_number ?? 0,
        );

        if (!transactions) {
          continue;
        }

        for (const transaction of transactions) {
          const newTransaction =
            this.launchboxTokenTransactionRepository.create({
              id: uuidv4(),
              address: transaction.address,
              token_value: transaction.tokenValue,
              eth_value: transaction.ethValue,
              fee: transaction.fee,
              type: transaction.type,
              transaction_hash: transaction.transactionHash,
              block_number: transaction.blockNumber,
              token_id: token.id,
            });

          await this.launchboxTokenTransactionRepository.save(newTransaction);
        }
      }

      return successResponse({
        status: true,
        message: 'Tokens transactions seeded successfully',
      });
    } catch (error) {
      this.logger.error(
        'An error occurred while seeding the token transactions.',
        error,
      );

      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'An error occurred while seeding the token transactions. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  private validateBodyChain(chain: Chain) {
    const chainDTO = plainToInstance(ChainDto, chain);

    const validationErrors = validateSync(chainDTO);

    if (validationErrors.length > 0) {
      const errorMessage = Object.values(
        validationErrors[0].constraints as {
          [type: string]: string;
        },
      )[0];

      throw new ServiceError(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  private validateBodySocial(socials: SocialDto) {
    const socialDTO = plainToInstance(SocialDto, socials);

    const validationErrors = validateSync(socialDTO);

    if (validationErrors.length > 0) {
      const errorMessage = Object.values(
        validationErrors[0].constraints as {
          [type: string]: string;
        },
      )[0];

      throw new ServiceError(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }
}
