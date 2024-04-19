import { Module } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { MigrationController } from './migration.controller';
import { CloudinaryModule } from 'src/common/helpers/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Migration } from 'typeorm';
import { GithubModule } from 'src/common/helpers/github/github.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Migration]),
    CloudinaryModule,
    JwtModule,
    GithubModule,
  ],
  providers: [MigrationService],
  controllers: [MigrationController],
  exports: [MigrationService],
})
export class MigrationModule {}
