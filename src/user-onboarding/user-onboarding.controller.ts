import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-roles.enum';
import { UserOnboardingService } from './user-onboarding.service';
import {
  UpdateUserProfileDto,
  OnboardingQuizDto,
  SubmitOnboardingQuizDto,
  PersonalizedHomepageDto,
} from './user-onboarding.dto';

@ApiTags('User Onboarding & Personalization')
@Controller('user-onboarding')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class UserOnboardingController {
  constructor(private readonly userOnboardingService: UserOnboardingService) {}

  @Put('profile')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update user profile for onboarding',
    description: 'Updates user profile information including age, gender, grade level, learning preferences, and weak subjects.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  async updateProfile(
    @Request() req: any,
    @Body() updateData: UpdateUserProfileDto,
  ) {
    return this.userOnboardingService.updateUserProfile(req.user.sub, updateData);
  }

  @Post('quiz/generate')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Generate personalized onboarding quiz with AI',
    description: 'Generates a personalized assessment quiz using LangGraph and Gemini 2.0 Flash to identify user\'s weak subjects and learning needs.',
  })
  @ApiResponse({
    status: 201,
    description: 'Onboarding quiz generated successfully using AI',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid quiz parameters',
  })
  async generateOnboardingQuiz(
    @Request() req: any,
    @Body() quizData: OnboardingQuizDto,
  ) {
    return this.userOnboardingService.generateOnboardingQuiz(req.user.sub, quizData);
  }

  @Post('quiz/submit')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit onboarding quiz answers for AI analysis',
    description: 'Submits quiz answers and uses LangGraph with Gemini 2.0 Flash to analyze results, identify weak subjects, and generate personalized recommendations.',
  })
  @ApiResponse({
    status: 201,
    description: 'Quiz answers analyzed successfully with AI-powered insights',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid quiz answers',
  })
  async submitOnboardingQuiz(
    @Request() req: any,
    @Body() quizAnswers: SubmitOnboardingQuizDto,
  ) {
    return this.userOnboardingService.submitOnboardingQuiz(req.user.sub, quizAnswers);
  }

  @Post('homepage/personalized')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Generate personalized homepage with AI recommendations',
    description: 'Creates a personalized homepage using LangGraph and Gemini 2.0 Flash based on user\'s weak subjects, learning style, progress, and preferences.',
  })
  @ApiResponse({
    status: 201,
    description: 'Personalized homepage generated successfully with AI-powered content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async generatePersonalizedHomepage(
    @Request() req: any,
    @Body() options: PersonalizedHomepageDto,
  ) {
    return this.userOnboardingService.generatePersonalizedHomepage(req.user.sub, options);
  }

  @Get('homepage/personalized')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get personalized homepage with default settings',
    description: 'Retrieves personalized homepage content using AI with default recommendation settings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Personalized homepage retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getPersonalizedHomepage(@Request() req: any) {
    const defaultOptions: PersonalizedHomepageDto = {
      lessonCount: 10,
      includeQuizzes: true,
      includeProgress: true,
    };
    return this.userOnboardingService.generatePersonalizedHomepage(req.user.sub, defaultOptions);
  }

  @Get('profile/:userId')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get user profile by ID (Admin/Teacher only)',
    description: 'Retrieves user profile information for administrative purposes.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID to retrieve profile for',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserProfile(@Param('userId') userId: string) {
    return this.userOnboardingService.getUserProfile(userId);
  }

  @Post('recommendations/refresh')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Refresh AI-powered recommendations',
    description: 'Regenerates personalized recommendations using latest user progress and AI analysis with LangGraph and Gemini 2.0 Flash.',
  })
  @ApiResponse({
    status: 201,
    description: 'Recommendations refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  async refreshRecommendations(@Request() req: any) {
    return this.userOnboardingService.refreshRecommendations(req.user.sub);
  }

  @Get('analytics/weak-subjects')
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Get detailed weak subjects analysis',
    description: 'Provides detailed analysis of user\'s weak subjects with AI-generated improvement strategies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Weak subjects analysis retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  async getWeakSubjectsAnalysis(@Request() req: any) {
    return this.userOnboardingService.generateWeaknessAnalysis(req.user.sub);
  }

  @Get('parent-requests')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Get pending parent connection requests',
    description: 'Retrieves all pending parent connection requests for the student.',
  })
  @ApiResponse({
    status: 200,
    description: 'Parent connection requests retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  async getParentRequests(@Request() req: any) {
    return this.userOnboardingService.getParentRequests(req.user.sub);
  }

  @Put('parent-requests/:connectionId/approve')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Approve parent connection request',
    description: 'Approves a parent connection request, allowing the parent to monitor student progress.',
  })
  @ApiParam({
    name: 'connectionId',
    description: 'Connection request ID to approve',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Parent connection request approved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Connection request not found',
  })
  async approveParentRequest(
    @Request() req: any,
    @Param('connectionId') connectionId: string
  ) {
    return this.userOnboardingService.approveParentRequest(req.user.sub, connectionId);
  }

  @Put('parent-requests/:connectionId/reject')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Reject parent connection request',
    description: 'Rejects a parent connection request.',
  })
  @ApiParam({
    name: 'connectionId',
    description: 'Connection request ID to reject',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Parent connection request rejected successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 404,
    description: 'Connection request not found',
  })
  async rejectParentRequest(
    @Request() req: any,
    @Param('connectionId') connectionId: string
  ) {
    return this.userOnboardingService.rejectParentRequest(req.user.sub, connectionId);
  }

  @Get('connected-parents')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Get connected parents',
    description: 'Retrieves all approved parent connections for the student.',
  })
  @ApiResponse({
    status: 200,
    description: 'Connected parents retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  async getConnectedParents(@Request() req: any) {
    return this.userOnboardingService.getConnectedParents(req.user.sub);
  }
}