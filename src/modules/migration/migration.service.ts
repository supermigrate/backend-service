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
import { GithubService } from 'src/common/helpers/github/github.service';
import { Chain, Migrate } from './interfaces/migration.interface';

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
        status: 'pending',
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
          { status: 'failed' },
        );

        throw new ServiceError('Migration failed', HttpStatus.BAD_REQUEST);
      }

      await this.migrationRepository.update(
        { id: migration.id },
        { status: 'processing', pull_requests: response.data },
      );

      return {
        status: true,
        message: 'Migration successful',
      };
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
}
