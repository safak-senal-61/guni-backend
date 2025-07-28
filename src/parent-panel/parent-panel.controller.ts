import { Controller, Get, Post, Put, UseGuards, Request, Body, Param, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-roles.enum';
import { ParentPanelService } from './parent-panel.service';
import { ParentPanelAnalyticsService } from './parent-panel.analytics.service';
import { ConnectStudentDto, SendNotificationDto, GetStudentDetailedProgressDto } from './parent-panel.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('parent-panel')
@Controller('parent-panel')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.PARENT)
@ApiBearerAuth()
export class ParentPanelController {
  constructor(
    private readonly parentPanelService: ParentPanelService,
    private readonly analyticsService: ParentPanelAnalyticsService
  ) {}

  @Get('profile')
  @Roles(UserRole.PARENT)
  @ApiOperation({
    summary: 'Get parent profile',
    description: 'Retrieves the parent profile information including connected students.'
  })
  @ApiResponse({ status: 200, description: 'Parent profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' })
  async getProfile(@Request() req) {
    return this.parentPanelService.getParentProfile(req.user.id);
  }

  @Post('connect-student')
  @Roles(UserRole.PARENT)
  @ApiOperation({
    summary: 'Request student connection',
    description: 'Sends a connection request to a student for monitoring their progress.'
  })
  @ApiResponse({ status: 201, description: 'Connection request sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid student email or connection already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' })
  async connectStudent(@Request() req, @Body() connectDto: ConnectStudentDto) {
    return this.parentPanelService.requestStudentConnection(req.user.id, connectDto);
  }

  @Get('pending-connections')
  @Roles(UserRole.PARENT)
  @ApiOperation({
    summary: 'Get pending connections',
    description: 'Retrieves all pending student connection requests.'
  })
  @ApiResponse({ status: 200, description: 'Pending connections retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' })
  async getPendingConnections(@Request() req) {
    return this.parentPanelService.getPendingConnections(req.user.id);
  }

  @Get('connected-students')
  @Roles(UserRole.PARENT)
  @ApiOperation({
    summary: 'Get connected students',
    description: 'Retrieves all approved student connections.'
  })
  @ApiResponse({ status: 200, description: 'Connected students retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' })
  async getConnectedStudents(@Request() req) {
    return this.parentPanelService.getConnectedStudents(req.user.id);
  }

  @Get('student-progress/:studentId')
  @Roles(UserRole.PARENT)
  async getStudentDetailedProgress(
    @Request() req,
    @Param('studentId') studentId: string,
    @Query('subject') subject?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const dto: GetStudentDetailedProgressDto = {
      studentId,
      subject,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined
    };
    return this.parentPanelService.getStudentDetailedProgress(req.user.id, dto);
  }

  @Get('student-analytics/:studentId')
  @Roles(UserRole.PARENT)
  async getStudentAnalytics(
    @Request() req,
    @Param('studentId') studentId: string
  ) {
    return this.parentPanelService.getStudentAnalytics(req.user.id, studentId);
  }

  @Post('send-message')
  @Roles(UserRole.PARENT)
  async sendMessageToStudent(
    @Request() req,
    @Body() body: { studentId: string; message: string; type: string }
  ) {
    return this.parentPanelService.sendMessageToStudent(req.user.id, body.studentId, body.message, body.type);
  }

  @Get('dashboard-summary')
  @Roles(UserRole.PARENT)
  async getDashboardSummary(@Request() req) {
    return this.parentPanelService.getDashboardSummary(req.user.id);
  }

  @Get('student-schedule/:studentId')
  @Roles(UserRole.PARENT)
  async getStudentSchedule(
    @Request() req,
    @Param('studentId') studentId: string
  ) {
    return this.parentPanelService.getStudentSchedule(req.user.id, studentId);
  }

  @Post('set-study-goals')
  @Roles(UserRole.PARENT)
  async setStudyGoals(
    @Request() req,
    @Body() body: { studentId: string; goals: any[] }
  ) {
    return this.parentPanelService.setStudyGoals(req.user.id, body.studentId, body.goals);
  }

  @Post('send-notification')
  @Roles(UserRole.PARENT)
  async sendNotification(@Request() req, @Body() notificationDto: SendNotificationDto) {
    return this.parentPanelService.sendNotificationToStudent(req.user.id, notificationDto);
  }

  @Get('notifications')
  @Roles(UserRole.PARENT)
  async getNotifications(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    return this.parentPanelService.getParentNotifications(req.user.id, pageNum, limitNum);
  }

  @Put('notifications/:notificationId/read')
  @Roles(UserRole.PARENT)
  async markNotificationAsRead(
    @Request() req,
    @Param('notificationId') notificationId: string
  ) {
    return this.parentPanelService.markNotificationAsRead(req.user.id, notificationId);
  }

  @Post('weekly-summary/:studentId')
  @Roles(UserRole.PARENT)
  async generateWeeklySummary(
    @Request() req,
    @Param('studentId') studentId: string
  ) {
    return this.parentPanelService.generateWeeklyProgressSummary(req.user.id, studentId);
  }

  @Get('student-summary/:studentId')
  @Roles(UserRole.PARENT)
  async getStudentProgressSummary(
    @Request() req,
    @Param('studentId') studentId: string,
    @Query('period') period: 'week' | 'month' = 'week'
  ) {
    return this.analyticsService.getStudentProgressSummary(req.user.id, studentId, period);
  }

  @Get('dashboard-stats')
  @Roles(UserRole.PARENT)
  async getDashboardStats(@Request() req) {
    const connections = await this.parentPanelService.getConnectedStudents(req.user.id);
    const stats = await Promise.all(
      connections.map(async (conn) => {
        const summary = await this.analyticsService.getStudentProgressSummary(
          req.user.id,
          conn.id,
          'week'
        );
        return {
          studentId: conn.id,
          studentName: `${conn.firstName} ${conn.lastName}`,
          ...summary
        };
      })
    );
    return stats;
  }
}
