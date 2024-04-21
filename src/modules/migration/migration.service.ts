import { HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/entities/user.entity';
import { IResponse } from '../../common/interfaces/response.interface';
import { ServiceError } from '../../common/errors/service.error';
import { CloudinaryService } from '../../common/helpers/cloudinary/cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Migration } from './entities/migration.entity';
import { MigrateDto } from './dtos/migration.dto';
import { GithubService } from '../../common/helpers/github/github.service';
import { Chain, Migrate, PullRequest } from './interfaces/migration.interface';
import { successResponse } from '../../common/responses/success.helper';
import { PrStatus, Status } from './enums/migration.enum';

@Injectable()
export class MigrationService {
  constructor(
    @InjectRepository(Migration)
    private readonly migrationRepository: Repository<Migration>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly githubService: GithubService,
  ) {}
  async migrate(
    user: User,
    file: Express.Multer.File,
    body: MigrateDto,
  ): Promise<IResponse | ServiceError> {
    try {
      const formattedChains: Chain = JSON.parse(body.chains);

      if (!Array.isArray(formattedChains)) {
        throw new ServiceError('Invalid chains', HttpStatus.BAD_REQUEST);
      }

      const formatedBody: Migrate = {
        ...body,
        chains: formattedChains,
      };

      const logoUrl = await this.cloudinaryService.upload(file);

      if (!logoUrl) {
        throw new ServiceError('Upload failed', HttpStatus.BAD_REQUEST);
      }

      const migration = this.migrationRepository.create({
        id: uuidv4(),
        name: body.name,
        symbol: body.symbol,
        decimals: body.decimals,
        description: body.description,
        website: body.website,
        twitter: body.twitter,
        logo_url: logoUrl,
        user_id: user.id,
        status: Status.PENDING,
        metadata: {},
      });

      await this.migrationRepository.save(migration);

      const response = await this.githubService.migrateData(
        formatedBody,
        file,
        logoUrl,
      );

      if (!response.status) {
        await this.migrationRepository.update(
          { id: migration.id },
          { status: Status.FAILED },
        );

        throw new ServiceError('Migration failed', HttpStatus.BAD_REQUEST);
      }

      await this.migrationRepository.update(
        { id: migration.id },
        { status: Status.PROCESSING, pull_requests: response.data },
      );

      const updatedMigration = await this.migrationRepository.findOne({
        where: {
          id: migration.id,
        },
      });

      return successResponse({
        status: true,
        message: 'Migration successful',
        data: updatedMigration,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'Error migrating data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async getAll(user: User): Promise<IResponse | ServiceError> {
    try {
      const migrations = await this.migrationRepository.find({
        where: {
          user_id: user.id,
        },
      });

      return successResponse({
        status: true,
        message: 'Migrations fetched',
        data: migrations,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'Error getting all migrations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async getOne(user: User, id: string): Promise<IResponse | ServiceError> {
    try {
      const migration = await this.migrationRepository.findOne({
        where: {
          id,
          user_id: user.id,
        },
      });

      if (!migration) {
        throw new ServiceError('Migration not found', HttpStatus.NOT_FOUND);
      }

      const existPendingPullRequest = migration.pull_requests.some(
        (pullRequest) => pullRequest.status === PrStatus.PENDING,
      );

      if (existPendingPullRequest) {
        const prsStatus = (await this.githubService.getPullRequest(
          migration.pull_requests,
        )) as PullRequest[];

        const isStatusChange = this.isStatusChange(
          migration.pull_requests,
          prsStatus,
        );

        if (isStatusChange) {
          const allPrsMerged = prsStatus.some(
            (prStatus) => prStatus.status === PrStatus.MERGED,
          );

          await this.migrationRepository.update(
            { id: migration.id },
            {
              pull_requests: prsStatus,
              status: allPrsMerged ? Status.COMPLETED : Status.PROCESSING,
            },
          );
        }
      }

      const updatedMigration = await this.migrationRepository.findOne({
        where: {
          id: migration.id,
        },
      });

      return successResponse({
        status: true,
        message: 'Migration fetched',
        data: updatedMigration,
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'Error getting migration',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  private isStatusChange(
    pullRequests1: PullRequest[],
    pullRequests2: PullRequest[],
  ): boolean {
    if (pullRequests1.length !== pullRequests2.length) {
      return false;
    }

    for (let i = 0; i < pullRequests1.length; i++) {
      if (pullRequests1[i].status !== pullRequests2[i].status) {
        return true;
      }
    }

    return false;
  }
}
