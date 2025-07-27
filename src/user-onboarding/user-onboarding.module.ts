import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserOnboardingController } from './user-onboarding.controller';
import { UserOnboardingService } from './user-onboarding.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserOnboardingController],
  providers: [UserOnboardingService],
  exports: [UserOnboardingService],
})
export class UserOnboardingModule {}