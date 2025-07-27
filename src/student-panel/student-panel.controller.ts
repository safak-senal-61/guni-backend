import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { StudentPanelService } from './student-panel.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/enums/user-roles.enum';

@Controller('student-panel')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.STUDENT)
export class StudentPanelController {
  constructor(private readonly studentPanelService: StudentPanelService) {}

  @Get('dashboard')
  async getDashboard(@Request() req) {
    return this.studentPanelService.getStudentDashboard(req.user.userId);
  }

  @Get('progress')
  async getProgress(@Request() req) {
    return this.studentPanelService.getStudentProgress(req.user.userId);
  }

  @Get('stats')
  async getStats(@Request() req) {
    return this.studentPanelService.getStudentStats(req.user.userId);
  }

  @Get('upcoming-lessons')
  async getUpcomingLessons(
    @Request() req,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.studentPanelService.getUpcomingLessons(req.user.userId, limitNum);
  }

  @Get('recommended-quizzes')
  async getRecommendedQuizzes(
    @Request() req,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 3;
    return this.studentPanelService.getRecommendedQuizzes(req.user.userId, limitNum);
  }

  @Get('recent-quiz-results')
  async getRecentQuizResults(
    @Request() req,
    @Query('limit') limit?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.studentPanelService.getRecentQuizResults(req.user.userId, limitNum);
  }
}
