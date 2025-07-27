import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAchievementDto } from './achievements.dto';
import { AchievementCategory } from '@prisma/client';

@Injectable()
export class AchievementsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async createAchievement(data: CreateAchievementDto) {
    return this.prisma.achievement.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        points: data.points,
        icon: data.icon || '',
        requirements: { value: data.requirement },
        rarity: 'common',
      },
    });
  }

  async getAllAchievements() {
    return this.prisma.achievement.findMany({
      // where: { isActive: true }, // Remove if field doesn't exist
      orderBy: { points: 'asc' },
    });
  }

  async getUserAchievements(userId: string) {
    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });

    const allAchievements = await this.getAllAchievements();
    const unlockedIds = userAchievements.map(ua => ua.achievementId);
    
    const lockedAchievements = allAchievements.filter(
      achievement => !unlockedIds.includes(achievement.id)
    );

    return {
      unlocked: userAchievements,
      locked: lockedAchievements,
      totalPoints: userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0),
      unlockedCount: userAchievements.length,
      totalCount: allAchievements.length,
    };
  }

  async unlockAchievement(userId: string, achievementId: string) {
    // Check if already unlocked
    const existing = await this.prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Unlock achievement
    const userAchievement = await this.prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
        unlockedAt: new Date(),
      },
      include: {
        achievement: true,
      },
    });

    // Send notification
    await this.notificationsService.notifyAchievementUnlocked(
      userId,
      userAchievement.achievement.title,
    );

    return userAchievement;
  }

  async checkAndUnlockAchievements(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          quizzesTaken: true,
          lessonsCompleted: true,
          achievements: true,
        },
      });

      if (!user) return [];

      const achievements = await this.getAllAchievements();
      const unlockedIds = user.achievements.map(ua => ua.achievementId);
      const availableAchievements = achievements.filter(
        achievement => !unlockedIds.includes(achievement.id)
      );

      const newUnlocks: any[] = [];

    for (const achievement of availableAchievements) {
      let shouldUnlock = false;

      switch (achievement.category) {
        case AchievementCategory.PROGRESS:
          const completedLessons = user.lessonsCompleted.filter(lp => lp.completed).length;
          const progressReq = typeof achievement.requirements === 'object' ? 
            (achievement.requirements as any).value || 5 : 
            5;
          shouldUnlock = completedLessons >= progressReq;
          break;

        case AchievementCategory.SUBJECT_MASTERY:
          const completedQuizzes = user.quizzesTaken.filter(qa => qa.score >= 80).length;
          const masteryReq = typeof achievement.requirements === 'object' ? 
            (achievement.requirements as any).value || 10 : 
            10;
          shouldUnlock = completedQuizzes >= masteryReq;
          break;

        case AchievementCategory.GAMIFICATION:
          // Calculate streak logic here
          const recentProgress = user.lessonsCompleted
            .filter(lp => lp.completed)
            .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime());
          
          let streak = 0;
          let currentDate = new Date();
          
          for (const progress of recentProgress) {
            const progressDate = new Date(progress.lastAccessed);
            const daysDiff = Math.floor((currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 1) {
              streak++;
              currentDate = progressDate;
            } else {
              break;
            }
          }
          
          const streakReq = typeof achievement.requirements === 'object' ? 
            (achievement.requirements as any).value || 7 : 
            7;
          shouldUnlock = streak >= streakReq;
          break;

        case AchievementCategory.SPECIAL:
          const totalPoints = user.achievements.reduce((sum, ua) => {
            const ach = achievements.find(a => a.id === ua.achievementId);
            return sum + (ach?.points || 0);
          }, 0);
          const specialReq = typeof achievement.requirements === 'object' ? 
            (achievement.requirements as any).value || 1000 : 
            1000;
          shouldUnlock = totalPoints >= specialReq;
          break;
      }

      if (shouldUnlock) {
        const newAchievement = await this.unlockAchievement(userId, achievement.id);
        newUnlocks.push(newAchievement);
      }
    }

    return newUnlocks;
    } catch (error) {
      console.error('Error in checkAndUnlockAchievements:', error);
      throw error;
    }
  }

  async getUserLeaderboard(limit: number = 10) {
    const users = await this.prisma.user.findMany({
      include: {
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    const leaderboard = users.map(user => {
      const totalPoints = user.achievements.reduce(
        (sum, ua) => sum + ua.achievement.points,
        0
      );
      
      return {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        totalPoints,
        achievementCount: user.achievements.length,
      };
    });

    return leaderboard
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);
  }
}