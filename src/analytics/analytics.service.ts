import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getOverallStats() {
    const [totalUsers, totalLessons, totalQuizzes, totalMessages] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.lesson.count(),
      this.prisma.quiz.count(),
      this.prisma.message.count(),
    ]);

    const [students, teachers, parents, admins] = await Promise.all([
      this.prisma.user.count({ where: { role: UserRole.STUDENT } }),
      this.prisma.user.count({ where: { role: UserRole.TEACHER } }),
      this.prisma.user.count({ where: { role: UserRole.PARENT } }),
      this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
    ]);

    return {
      totalUsers,
      totalLessons,
      totalQuizzes,
      totalMessages,
      usersByRole: {
        students,
        teachers,
        parents,
        admins,
      },
    };
  }

  async getUserEngagementStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [activeUsers, lessonCompletions, quizAttempts, messagesSent] = await Promise.all([
      this.getActiveUsers(startDate),
      this.getLessonCompletions(startDate),
      this.getQuizAttempts(startDate),
      this.getMessagesSent(startDate),
    ]);

    return {
      period: `${days} days`,
      activeUsers,
      lessonCompletions,
      quizAttempts,
      messagesSent,
    };
  }

  async getLearningProgress() {
    const [avgLessonCompletion, avgQuizScore, topPerformers] = await Promise.all([
      this.getAverageLessonCompletion(),
      this.getAverageQuizScore(),
      this.getTopPerformers(),
    ]);

    return {
      avgLessonCompletion,
      avgQuizScore,
      topPerformers,
    };
  }

  async getContentAnalytics() {
    const [popularLessons, difficultQuizzes, contentByDifficulty] = await Promise.all([
      this.getPopularLessons(),
      this.getDifficultQuizzes(),
      this.getContentByDifficulty(),
    ]);

    return {
      popularLessons,
      difficultQuizzes,
      contentByDifficulty,
    };
  }

  async getUserActivityTimeline(days: number = 7) {
    const timeline: Array<{
      date: string;
      lessonCompletions: number;
      quizAttempts: number;
      newUsers: number;
      messagesSent: number;
    }> = [];
    const currentDate = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [lessonCompletions, quizAttempts, newUsers, messagesSent] = await Promise.all([
        this.prisma.lessonProgress.count({
          where: {
            completed: true,
            lastAccessed: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
        this.prisma.quizAttempt.count({
          where: {
            attemptDate: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
        this.prisma.user.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
        this.prisma.message.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
      ]);

      timeline.push({
        date: date.toISOString().split('T')[0],
        lessonCompletions,
        quizAttempts,
        newUsers,
        messagesSent,
      });
    }

    return timeline;
  }

  async getParentEngagement() {
    const [totalConnections, activeParents, parentMessages] = await Promise.all([
      this.prisma.parentStudentConnection.count({
        where: { connectionStatus: 'approved' },
      }),
      this.prisma.user.count({
        where: {
          role: UserRole.PARENT,
          updatedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
      }),
      this.prisma.message.count({
        where: {
          sender: {
            role: UserRole.PARENT,
          },
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      totalConnections,
      activeParents,
      parentMessages,
    };
  }

  async getAchievementStats() {
    const [totalAchievements, unlockedAchievements, topAchievers] = await Promise.all([
      this.prisma.achievement.count(),
      this.prisma.userAchievement.count(),
      this.prisma.userAchievement.groupBy({
        by: ['userId'],
        _count: {
          achievementId: true,
        },
        orderBy: {
          _count: {
            achievementId: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    const topAchieversWithNames = await Promise.all(
      topAchievers.map(async (achiever) => {
        const user = await this.prisma.user.findUnique({
          where: { id: achiever.userId },
          select: { firstName: true, lastName: true },
        });
        return {
          userId: achiever.userId,
          name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          achievementCount: achiever._count.achievementId,
        };
      })
    );

    return {
      totalAchievements,
      unlockedAchievements,
      topAchievers: topAchieversWithNames,
    };
  }

  private async getActiveUsers(startDate: Date) {
    return this.prisma.user.count({
      where: {
        OR: [
          {
            lessonsCompleted: {
          some: {
            lastAccessed: {
              gte: startDate,
            },
          },
        },
          },
          {
            quizzesTaken: {
              some: {
                attemptDate: {
                  gte: startDate,
                },
              },
            },
          },
          {
            messages: {
            some: {
              createdAt: {
                gte: startDate,
              },
            },
          },
          },
        ],
      },
    });
  }

  private async getLessonCompletions(startDate: Date) {
    return this.prisma.lessonProgress.count({
      where: {
        completed: true,
        lastAccessed: {
          gte: startDate,
        },
      },
    });
  }

  private async getQuizAttempts(startDate: Date) {
    return this.prisma.quizAttempt.count({
      where: {
        attemptDate: {
          gte: startDate,
        },
      },
    });
  }

  private async getMessagesSent(startDate: Date) {
    return this.prisma.message.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });
  }

  private async getAverageLessonCompletion() {
    const totalLessons = await this.prisma.lesson.count();
    const totalStudents = await this.prisma.user.count({ where: { role: UserRole.STUDENT } });
    const completedLessons = await this.prisma.lessonProgress.count({
      where: { completed: true },
    });

    if (totalStudents === 0 || totalLessons === 0) return 0;
    return (completedLessons / (totalStudents * totalLessons)) * 100;
  }

  private async getAverageQuizScore() {
    const result = await this.prisma.quizAttempt.aggregate({
      _avg: {
        score: true,
      },
    });
    return result._avg.score || 0;
  }

  private async getTopPerformers(limit: number = 10) {
    const topStudents = await this.prisma.user.findMany({
      where: { role: UserRole.STUDENT },
      include: {
        quizzesTaken: {
          select: {
            score: true,
          },
        },
        lessonsCompleted: {
          where: { completed: true },
          select: {
            id: true,
          },
        },
      },
    });

    const studentsWithStats = topStudents.map(student => {
      const avgScore = student.quizzesTaken.length > 0 
        ? student.quizzesTaken.reduce((sum, attempt) => sum + attempt.score, 0) / student.quizzesTaken.length
        : 0;
      const completedLessons = student.lessonsCompleted.length;
      
      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        avgScore,
        completedLessons,
        overallScore: (avgScore * 0.7) + (completedLessons * 2), // Weighted score
      };
    });

    return studentsWithStats
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);
  }

  private async getPopularLessons(limit: number = 10) {
    return this.prisma.lesson.findMany({
      include: {
        _count: {
          select: {
            progress: {
              where: { completed: true },
            },
          },
        },
      },
      orderBy: {
        progress: {
          _count: 'desc',
        },
      },
      take: limit,
    });
  }

  private async getDifficultQuizzes(limit: number = 10) {
    const quizzes = await this.prisma.quiz.findMany({
      include: {
        attempts: {
          select: {
            score: true,
          },
        },
      },
    });

    const quizzesWithAvgScore = quizzes.map(quiz => {
      const avgScore = quiz.attempts.length > 0
        ? quiz.attempts.reduce((sum, attempt) => sum + attempt.score, 0) / quiz.attempts.length
        : 0;
      
      return {
        id: quiz.id,
        title: quiz.title,
        difficulty: quiz.difficulty,
        averageScore: avgScore,
        attemptCount: quiz.attempts.length,
      };
    });

    return quizzesWithAvgScore
      .filter(quiz => quiz.attemptCount >= 5) // Only quizzes with at least 5 attempts
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, limit);
  }

  private async getContentByDifficulty() {
    const [beginnerLessons, intermediateLessons, advancedLessons] = await Promise.all([
      this.prisma.lesson.count({ where: { difficulty: 'BEGINNER' } }),
      this.prisma.lesson.count({ where: { difficulty: 'INTERMEDIATE' } }),
      this.prisma.lesson.count({ where: { difficulty: 'ADVANCED' } }),
    ]);

    const [beginnerQuizzes, intermediateQuizzes, advancedQuizzes] = await Promise.all([
      this.prisma.quiz.count({ where: { difficulty: 'BEGINNER' } }),
      this.prisma.quiz.count({ where: { difficulty: 'INTERMEDIATE' } }),
      this.prisma.quiz.count({ where: { difficulty: 'ADVANCED' } }),
    ]);

    return {
      lessons: {
        beginner: beginnerLessons,
        intermediate: intermediateLessons,
        advanced: advancedLessons,
      },
      quizzes: {
        beginner: beginnerQuizzes,
        intermediate: intermediateQuizzes,
        advanced: advancedQuizzes,
      },
    };
  }
}