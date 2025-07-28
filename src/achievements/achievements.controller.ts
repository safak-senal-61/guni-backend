import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './achievements.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserRole } from '../common/enums/user-roles.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('achievements')
@Controller('achievements')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create new achievement',
    description: 'Creates a new achievement. Only ADMIN role can create achievements.'
  })
  @ApiResponse({ status: 201, description: 'Achievement created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only ADMIN role can create achievements' })
  async createAchievement(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.createAchievement(createAchievementDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all achievements',
    description: 'Retrieves all available achievements in the system.'
  })
  @ApiResponse({ status: 200, description: 'All achievements retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' })
  async getAllAchievements() {
    return this.achievementsService.getAllAchievements();
  }

  @Get('my-achievements')
  @ApiOperation({
    summary: 'Get user achievements',
    description: 'Retrieves all achievements unlocked by the current user.'
  })
  @ApiResponse({ status: 200, description: 'User achievements retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' })
  async getUserAchievements(@Request() req) {
    return this.achievementsService.getUserAchievements(req.user.userId);
  }

  @Post('check-unlocks')
  async checkAndUnlockAchievements(@Request() req) {
    try {
      return await this.achievementsService.checkAndUnlockAchievements(req.user.userId);
    } catch (error) {
      console.error('Error in checkAndUnlockAchievements controller:', error);
      throw error;
    }
  }

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.achievementsService.getUserLeaderboard(limitNum);
  }

  @Post('unlock/:achievementId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async unlockAchievement(
    @Param('achievementId') achievementId: string,
    @Body('userId') userId: string,
  ) {
    return this.achievementsService.unlockAchievement(userId, achievementId);
  }
}