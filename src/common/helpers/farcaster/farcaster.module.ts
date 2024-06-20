import { Module } from '@nestjs/common';
import { FarcasterService } from './farcaster.service';

@Module({
  providers: [FarcasterService],
  exports: [FarcasterService],
})
export class FarcasterModule {}
