import { Module } from '@nestjs/common';
import { ContentAnalysisService } from './content-analysis.service';
import { ContentAnalysisController } from './content-analysis.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ContentAnalysisService],
  controllers: [ContentAnalysisController]
})
export class ContentAnalysisModule {}
