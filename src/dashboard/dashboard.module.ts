import { Module } from '@nestjs/common';
import { DashboardController } from '../user-onboarding/dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserOnboardingModule } from '../user-onboarding/user-onboarding.module';

@Module({
  imports: [PrismaModule, UserOnboardingModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}