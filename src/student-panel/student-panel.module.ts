import { Module } from '@nestjs/common';
import { StudentPanelController } from './student-panel.controller';
import { StudentPanelService } from './student-panel.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AchievementsModule } from '../achievements/achievements.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, AchievementsModule, NotificationsModule],
  controllers: [StudentPanelController],
  providers: [StudentPanelService],
  exports: [StudentPanelService],
})
export class StudentPanelModule {}
