import { Module, OnModuleInit } from '@nestjs/common';
import { EarnService } from './earn.service';
import { EarnController } from './earn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Referral } from './entities/referral.entity';
import { Multiplier } from './entities/multiplier.entity';
import { User } from '../user/entities/user.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Activity,
      Referral,
      Transaction,
      Multiplier,
    ]),
  ],
  exports: [EarnService],
  providers: [EarnService],
  controllers: [EarnController],
})
export class EarnModule implements OnModuleInit {
  constructor(private readonly earnService: EarnService) {}

  async onModuleInit() {
    await this.earnService.seedActivities();
  }
}
