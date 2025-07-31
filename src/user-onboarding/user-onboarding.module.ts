import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ContentAnalysisModule } from '../content-analysis/content-analysis.module';
import { UserOnboardingController } from './user-onboarding.controller';
import { UserOnboardingService } from './user-onboarding.service';

@Module({
  imports: [PrismaModule, ContentAnalysisModule],
  controllers: [UserOnboardingController],
  providers: [UserOnboardingService],
  exports: [UserOnboardingService],
})
export class UserOnboardingModule {}