import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AchievementsService } from '../achievements/achievements.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class StudentPanelService {
  constructor(
    private prisma: PrismaService,
    private achievementsService: AchievementsService,
    private notificationsService: NotificationsService,
  ) {}

  async getStudentDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        profile: true,
      },
    });

    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    const [lessonProgress, quizAttempts, achievements, notifications] = await Promise.all([
      this.getStudentProgress(userId),
      this.getRecentQuizResults(userId),
      this.achievementsService.getUserAchievements(userId),
      this.notificationsService.getUserNotifications(userId, 1, 5),
    ]);

    return {
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      progress: lessonProgress,
      recentQuizzes: quizAttempts,
      achievements,
      recentNotifications: notifications.notifications,
    };
  }

  async getStudentProgress(userId: string) {
    const [totalLessons, completedLessons, totalQuizzes, completedQuizzes] = await Promise.all([
      this.prisma.lesson.count({ where: { } }), // Remove isActive filter
      this.prisma.lessonProgress.count({
        where: { userId, completed: true },
      }),
      this.prisma.quiz.count({ where: { } }), // Remove isActive filter
      this.prisma.quizAttempt.count({
        where: { userId, score: { gte: 70 } },
      }),
    ]);

    const lessonProgress = await this.prisma.lessonProgress.findMany({
      where: { userId },
      include: {
          lesson: true,
        },
      orderBy: { lastAccessed: 'desc' },
      take: 10,
    });

    return {
      overview: {
        totalLessons,
        completedLessons,
        totalQuizzes,
        completedQuizzes,
        lessonCompletionRate: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
        quizSuccessRate: totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0,
      },
      recentLessons: lessonProgress,
    };
  }

  async getRecentQuizResults(userId: string, limit: number = 5) {
    return this.prisma.quizAttempt.findMany({
      where: { userId },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      orderBy: { attemptDate: 'desc' },
      take: limit,
    });
  }

  async getStudentStats(userId: string) {
    const [totalStudyTime, averageScore, streakData, weeklyProgress] = await Promise.all([
      this.getTotalStudyTime(userId),
      this.getAverageQuizScore(userId),
      this.getStudyStreak(userId),
      this.getWeeklyProgress(userId),
    ]);

    return {
      totalStudyTime,
      averageScore,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      weeklyProgress,
    };
  }

  private async getTotalStudyTime(userId: string) {
    const lessonProgress = await this.prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      include: {
        lesson: {
          select: {
            duration: true,
          },
        },
      },
    });

    return lessonProgress.reduce((total, progress) => {
      return total + (progress.lesson.duration || 0);
    }, 0);
  }

  private async getAverageQuizScore(userId: string) {
    const result = await this.prisma.quizAttempt.aggregate({
      where: { userId },
      _avg: {
        score: true,
      },
    });

    return result._avg.score || 0;
  }

  private async getStudyStreak(userId: string) {
    const recentProgress = await this.prisma.lessonProgress.findMany({
      where: {
        userId,
        completed: true,
      },
      orderBy: { lastAccessed: 'desc' },
      take: 365, // Last year
    });

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Group by date
    const progressByDate = new Map();
    recentProgress.forEach(progress => {
      const date = new Date(progress.lastAccessed);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      progressByDate.set(dateStr, true);
    });

    // Calculate current streak
    let checkDate = new Date(currentDate);
    while (progressByDate.has(checkDate.toISOString().split('T')[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak
    const sortedDates = Array.from(progressByDate.keys()).sort();
    for (let i = 0; i < sortedDates.length; i++) {
      tempStreak = 1;
      for (let j = i + 1; j < sortedDates.length; j++) {
        const prevDate = new Date(sortedDates[j - 1]);
        const currDate = new Date(sortedDates[j]);
        const diffTime = currDate.getTime() - prevDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          break;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return { currentStreak, longestStreak };
  }

  private async getWeeklyProgress(userId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [lessonsThisWeek, quizzesThisWeek] = await Promise.all([
      this.prisma.lessonProgress.count({
        where: {
          userId,
          completed: true,
          lastAccessed: {
            gte: oneWeekAgo,
          },
        },
      }),
      this.prisma.quizAttempt.count({
        where: {
          userId,
          attemptDate: {
            gte: oneWeekAgo,
          },
        },
      }),
    ]);

    return {
      lessonsCompleted: lessonsThisWeek,
      quizzesAttempted: quizzesThisWeek,
    };
  }

  async getUpcomingLessons(userId: string, limit: number = 5) {
    const completedLessonIds = await this.prisma.lessonProgress
      .findMany({
        where: { userId, completed: true },
        select: { lessonId: true },
      })
      .then(progress => progress.map(p => p.lessonId));

    return this.prisma.lesson.findMany({
      where: {
        id: {
          notIn: completedLessonIds,
        },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async getRecommendedQuizzes(userId: string, limit: number = 3) {
    // Get user's completed lessons to recommend related quizzes
    const completedLessons = await this.prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      include: {
        lesson: {
          select: {
            subject: true,
            difficulty: true,
          },
        },
      },
    });

    if (completedLessons.length === 0) {
      return this.prisma.quiz.findMany({
        where: { }, // Remove isActive filter
        orderBy: { difficulty: 'asc' },
        take: limit,
      });
    }

    const subjects = [...new Set(completedLessons.map(cl => cl.lesson.subject))];
    const avgDifficulty = completedLessons.reduce((sum, cl) => {
      const difficultyMap = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3 };
      return sum + difficultyMap[cl.lesson.difficulty];
    }, 0) / completedLessons.length;

    const recommendedDifficulty = avgDifficulty <= 1.5 ? 'BEGINNER' : 
                                avgDifficulty <= 2.5 ? 'INTERMEDIATE' : 'ADVANCED';

    return this.prisma.quiz.findMany({
      where: {
        // isActive: true, // Remove if field doesn't exist
        subject: { in: subjects },
        difficulty: recommendedDifficulty,
      },
      take: limit,
    });
  }
}
