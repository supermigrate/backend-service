import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { LaunchboxService } from './launchbox.service';
import { LaunchboxController } from './launchbox.controller';
import {
  LaunchboxToken,
  LaunchboxTokenHolder,
  LaunchboxTokenTransaction,
} from './entities/launchbox.entity';
import { CloudinaryModule } from '../../common/helpers/cloudinary/cloudinary.module';
import { FarcasterModule } from '../../common/helpers/farcaster/farcaster.module';
import { ContractModule } from '../../common/helpers/contract/contract.module';
import { SharedModule } from '../../common/helpers/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LaunchboxToken,
      LaunchboxTokenHolder,
      LaunchboxTokenTransaction,
    ]),
    CloudinaryModule,
    FarcasterModule,
    HttpModule,
    ContractModule,
    SharedModule,
  ],
  providers: [LaunchboxService],
  controllers: [LaunchboxController],
  exports: [LaunchboxService],
})
export class LaunchboxModule implements OnApplicationBootstrap {
  constructor(private readonly launchboxService: LaunchboxService) {}

  async onApplicationBootstrap() {
    await this.launchboxService.init();
  }
}
