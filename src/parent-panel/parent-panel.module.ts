import { Module } from '@nestjs/common';
import { ParentPanelController } from './parent-panel.controller';
import { ParentPanelService } from './parent-panel.service';
import { ParentPanelAnalyticsService } from './parent-panel.analytics.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParentPanelController],
  providers: [ParentPanelService, ParentPanelAnalyticsService],
})
export class ParentPanelModule {}
