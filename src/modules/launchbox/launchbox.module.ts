import { Module } from '@nestjs/common';
import { LaunchboxService } from './launchbox.service';
import { LaunchboxController } from './launchbox.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaunchboxToken } from './entities/launchbox.entity';
import { CloudinaryModule } from '../../common/helpers/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([LaunchboxToken]), CloudinaryModule],
  providers: [LaunchboxService],
  controllers: [LaunchboxController],
  exports: [LaunchboxService],
})
export class LaunchboxModule {}
