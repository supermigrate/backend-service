import { Module } from '@nestjs/common';
import { LaunchboxService } from './launchbox.service';
import { LaunchboxController } from './launchbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LaunchboxToken,
  LaunchboxTokenHolder,
} from './entities/launchbox.entity';
import { CloudinaryModule } from '../../common/helpers/cloudinary/cloudinary.module';
import { FarcasterModule } from '../../common/helpers/farcaster/farcaster.module';
import { HttpModule } from '@nestjs/axios';
import { ContractModule } from '../../common/helpers/contract/contract.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LaunchboxToken, LaunchboxTokenHolder]),
    CloudinaryModule,
    FarcasterModule,
    HttpModule,
    ContractModule,
  ],
  providers: [LaunchboxService],
  controllers: [LaunchboxController],
  exports: [LaunchboxService],
})
export class LaunchboxModule {}
