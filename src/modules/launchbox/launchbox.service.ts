import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LaunchboxToken } from './entities/launchbox.entity';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChainDto, CreateDto, PaginateDto } from './dtos/launchbox.dto';
import { ServiceError } from '../../common/errors/service.error';
import { CloudinaryService } from '../../common/helpers/cloudinary/cloudinary.service';
import { IResponse } from '../../common/interfaces/response.interface';
import { successResponse } from '../../common/responses/success.helper';
import { Chain } from './interfaces/launchbox.interface';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

@Injectable()
export class LaunchboxService {
  constructor(
    @InjectRepository(LaunchboxToken)
    private readonly launchboxTokenRepository: MongoRepository<LaunchboxToken>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private logger = new Logger(LaunchboxService.name);

  async create(
    body: CreateDto,
    file: Express.Multer.File,
  ): Promise<IResponse | ServiceError> {
    try {
      const formattedChain: Chain = JSON.parse(body.chain);

      this.validateBodyChain(formattedChain);

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

  async findAll(query: PaginateDto): Promise<IResponse | ServiceError> {
    try {
      const totalTokens = await this.launchboxTokenRepository.count();

      const launchboxTokens = await this.launchboxTokenRepository.find({
        where: {
          is_active: true,
        },
        skip: query.skip,
        take: query.take,
      });

      return successResponse({
        status: true,
        message: 'Tokens fetched successfully',
        data: launchboxTokens,
        meta: {
          ...query,
          totalTokens,
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
}
