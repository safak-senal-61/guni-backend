import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-roles.enum';
import {
  GetAnalyticsDto,
  GetTimelineDto,
  GetTopPerformersDto,
  GetPopularContentDto,
} from './analytics.dto';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN, UserRole.TEACHER)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @HttpCode(HttpStatus.OK)
  async getOverview() {
    try {
      const stats = await this.analyticsService.getOverallStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Genel istatistikler alınırken hata oluştu',
        error: error.message,
      };
    }
  }

  @Get('engagement')
  @HttpCode(HttpStatus.OK)
  async getUserEngagement(@Query() query: GetAnalyticsDto) {
    try {
      const stats = await this.analyticsService.getUserEngagementStats(query.days);
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Kullanıcı etkileşim istatistikleri alınırken hata oluştu',
        error: error.message,
      };
    }
  }

  @Get('learning-progress')
  @HttpCode(HttpStatus.OK)
  async getLearningProgress() {
    try {
      const progress = await this.analyticsService.getLearningProgress();
      return {
        success: true,
        data: progress,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Öğrenme ilerlemesi istatistikleri alınırken hata oluştu',
        error: error.message,
      };
    }
  }

  @Get('content')
  @HttpCode(HttpStatus.OK)
  async getContentAnalytics() {
    try {
      const analytics = await this.analyticsService.getContentAnalytics();
      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      return {
        success: false,
        message: 'İçerik analitikleri alınırken hata oluştu',
        error: error.message,
      };
    }
  }

  @Get('timeline')
  @HttpCode(HttpStatus.OK)
  async getActivityTimeline(@Query() query: GetTimelineDto) {
    try {
      const timeline = await this.analyticsService.getUserActivityTimeline(query.days);
      return {
        success: true,
        data: timeline,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Aktivite zaman çizelgesi alınırken hata oluştu',
        error: error.message,
      };
    }
  }

  @Get('parent-engagement')
  @HttpCode(HttpStatus.OK)
  async getParentEngagement() {
    try {
      const engagement = await this.analyticsService.getParentEngagement();
      return {
        success: true,
        data: engagement,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Ebeveyn etkileşim istatistikleri alınırken hata oluştu',
        error: error.message,
      };
    }
  }

  @Get('achievements')
  @HttpCode(HttpStatus.OK)
  async getAchievementStats() {
    try {
      const stats = await this.analyticsService.getAchievementStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Başarı istatistikleri alınırken hata oluştu',
        error: error.message,
      };
    }
  }

  @Get('top-performers')
  @HttpCode(HttpStatus.OK)
  async getTopPerformers(@Query() query: GetTopPerformersDto) {
    try {
      const topPerformers = await this.analyticsService.getLearningProgress();
      return {
        success: true,
        data: topPerformers.topPerformers,
      };
    } catch (error) {
      return {
        success: false,
        message: 'En başarılı öğrenciler alınırken hata oluştu',
        error: error.message,
      };
    }
  }

  @Get('popular-content')
  @HttpCode(HttpStatus.OK)
  async getPopularContent(@Query() query: GetPopularContentDto) {
    try {
      const content = await this.analyticsService.getContentAnalytics();
      return {
        success: true,
        data: {
          popularLessons: content.popularLessons,
          difficultQuizzes: content.difficultQuizzes,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Popüler içerik istatistikleri alınırken hata oluştu',
        error: error.message,
      };
    }
  }
}