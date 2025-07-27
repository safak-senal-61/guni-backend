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

@Controller('achievements')
@UseGuards(AuthGuard('jwt'))
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async createAchievement(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.createAchievement(createAchievementDto);
  }

  @Get()
  async getAllAchievements() {
    return this.achievementsService.getAllAchievements();
  }

  @Get('my-achievements')
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