import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { AnalyticModule } from 'src/common/helpers/analytic/analytic.module';
import { env } from '../../common/config/env';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LaunchboxToken,
      LaunchboxTokenHolder,
      LaunchboxTokenTransaction,
    ]),
    CloudinaryModule,
    FarcasterModule,
    ContractModule,
    SharedModule,
    AnalyticModule,
  ],
  providers: [LaunchboxService],
  controllers: [LaunchboxController],
  exports: [LaunchboxService],
})
export class LaunchboxModule implements OnApplicationBootstrap {
  constructor(private readonly launchboxService: LaunchboxService) {}

  async onApplicationBootstrap() {
    if (env.isProduction) {
      await this.launchboxService.init();
    }
  }
}
