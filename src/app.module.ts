import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContentAnalysisModule } from './content-analysis/content-analysis.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { UploadsModule } from './uploads/uploads.module';
import { StudentPanelModule } from './student-panel/student-panel.module';
import { ParentPanelModule } from './parent-panel/parent-panel.module';
import { UserOnboardingModule } from './user-onboarding/user-onboarding.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AchievementsModule } from './achievements/achievements.module';
import { MessagesModule } from './messages/messages.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiChatModule } from './ai-chat/ai-chat.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    ContentAnalysisModule,
    LessonsModule,
    QuizzesModule,
    UploadsModule,
    StudentPanelModule,
    ParentPanelModule,
    UserOnboardingModule,
    NotificationsModule,
    AchievementsModule,
    MessagesModule,
    AnalyticsModule,
    AiChatModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
