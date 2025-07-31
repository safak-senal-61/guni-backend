import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserOnboardingService } from './user-onboarding.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly userOnboardingService: UserOnboardingService) {}

  @Get('weaknesses-analysis')
  @ApiOperation({ summary: 'Kullanıcının eksiklik analizi ve iyileştirme önerileri' })
  @ApiResponse({ status: 200, description: 'Eksiklik analizi başarıyla alındı' })
  async getWeaknessesAnalysis(@Request() req) {
    return this.userOnboardingService.generateWeaknessAnalysis(req.user.userId);
  }

  @Get('progress-tracking')
  @ApiOperation({ summary: 'Kullanıcının ilerleme takibi ve istatistikleri' })
  @ApiResponse({ status: 200, description: 'İlerleme takibi başarıyla alındı' })
  async getProgressTracking(
    @Request() req,
    @Query('period') period?: string // 'daily', 'weekly', 'monthly'
  ) {
    return this.userOnboardingService.generateProgressTracking(
      req.user.userId,
      period || 'weekly'
    );
  }

  @Get('study-recommendations')
  @ApiOperation({ summary: 'Kişiselleştirilmiş çalışma önerileri' })
  @ApiResponse({ status: 200, description: 'Çalışma önerileri başarıyla oluşturuldu' })
  async getStudyRecommendations(
    @Request() req,
    @Query('focus') focus?: string // 'weaknesses', 'general', 'exam-prep'
  ) {
    return this.userOnboardingService.generateStudyRecommendations(
      req.user.userId,
      focus || 'weaknesses'
    );
  }

  @Get('achievement-summary')
  @ApiOperation({ summary: 'Kullanıcının başarı özeti ve motivasyon verileri' })
  @ApiResponse({ status: 200, description: 'Başarı özeti başarıyla alındı' })
  async getAchievementSummary(@Request() req) {
    return this.userOnboardingService.generateAchievementSummary(req.user.userId);
  }

  @Get('personalized-homepage')
  @ApiOperation({ summary: 'Kişiselleştirilmiş ana sayfa içeriği' })
  @ApiResponse({ status: 200, description: 'Ana sayfa içeriği başarıyla oluşturuldu' })
  async getPersonalizedHomepage(
    @Request() req,
    @Query('includeProgress') includeProgress?: boolean,
    @Query('lessonCount') lessonCount?: number
  ) {
    return this.userOnboardingService.generatePersonalizedHomepage(
      req.user.userId,
      {
        includeProgress: includeProgress || true,
        lessonCount: lessonCount || 5
      }
    );
  }
}