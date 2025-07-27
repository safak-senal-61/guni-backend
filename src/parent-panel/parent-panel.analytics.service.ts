import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Recommendation {
  type: 'practice' | 'study_plan' | 'review';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
}

@Injectable()
export class ParentPanelAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getStudentAnalytics(parentId: string, studentId: string) {
    // Veli-öğrenci bağlantısını doğrula
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        parentId,
        studentId,
        connectionStatus: 'approved'
      }
    });

    if (!connection) {
      throw new Error('Bu öğrenciye erişim yetkiniz yok');
    }

    // Genel istatistikler
    const overview = await this.getStudentOverview(studentId);
    
    // Haftalık ilerleme
    const weeklyProgress = await this.getWeeklyProgress(studentId);
    
    // Konu performansı
    const subjectPerformance = await this.getSubjectPerformance(studentId);
    
    // Zaman dağılımı
    const timeDistribution = await this.getTimeDistribution(studentId);
    
    // Son aktiviteler
    const recentActivities = await this.getRecentActivities(studentId);
    
    // Başarılar
    const achievements = await this.getAchievements(studentId);
    
    // Zayıf alanlar
    const weakAreas = await this.getWeakAreas(studentId);
    
    // Öneriler
    const recommendations = await this.getRecommendations(studentId);

    return {
      overview,
      weeklyProgress,
      subjectPerformance,
      timeDistribution,
      recentActivities,
      achievements,
      weakAreas,
      recommendations
    };
  }

  private async getStudentOverview(studentId: string) {
    const [lessonsCompleted, quizzesCompleted, totalStudyTime, averageScore, streakData] = await Promise.all([
      this.prisma.lessonProgress.count({
        where: { userId: studentId, completed: true }
      }),
      this.prisma.quizAttempt.count({
        where: { userId: studentId }
      }),
      this.prisma.lessonProgress.aggregate({
        where: { userId: studentId },
        _sum: { timeSpent: true }
      }),
      this.prisma.quizAttempt.aggregate({
        where: { userId: studentId },
        _avg: { score: true }
      }),
      this.getStudyStreak(studentId)
    ]);

    return {
      totalStudyHours: Math.round((totalStudyTime._sum.timeSpent || 0) / 60),
      totalLessonsCompleted: lessonsCompleted,
      totalQuizzesCompleted: quizzesCompleted,
      averageScore: Math.round(averageScore._avg.score || 0),
      currentStreak: streakData.current,
      longestStreak: streakData.longest
    };
  }

  private async getWeeklyProgress(studentId: string) {
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const weeklyData = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('week', "createdAt") as week,
        COUNT(CASE WHEN "completed" = true THEN 1 END) as lessons_completed,
        0 as quizzes_completed,
        SUM("timeSpent") as study_minutes
      FROM "LessonProgress"
      WHERE "userId" = ${studentId} AND "createdAt" >= ${fourWeeksAgo}
      GROUP BY DATE_TRUNC('week', "createdAt")
      ORDER BY week
    ` as any[];

    const quizData = await this.prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('week', "createdAt") as week,
        COUNT(*) as quiz_count,
        AVG("score") as avg_score
      FROM "QuizAttempt"
      WHERE "userId" = ${studentId} AND "createdAt" >= ${fourWeeksAgo}
      GROUP BY DATE_TRUNC('week', "createdAt")
      ORDER BY week
    ` as any[];

    // Verileri birleştir ve formatla
    const combinedData = weeklyData.map(week => {
      const quiz = quizData.find(q => q.week.getTime() === week.week.getTime());
      return {
        week: week.week.toISOString().split('T')[0],
        lessonsCompleted: parseInt(week.lessons_completed),
        quizzesCompleted: quiz ? parseInt(quiz.quiz_count) : 0,
        studyHours: Math.round((week.study_minutes || 0) / 60),
        averageScore: quiz ? Math.round(quiz.avg_score) : 0
      };
    });

    return combinedData;
  }

  private async getSubjectPerformance(studentId: string) {
    const subjectData = await this.prisma.$queryRaw`
      SELECT 
        l."subject",
        COUNT(qa."id") as total_questions,
        SUM(CASE WHEN qa."score" >= 70 THEN 1 ELSE 0 END) as correct_answers,
        AVG(qa."score") as accuracy,
        AVG(qa."timeSpent") as average_time
      FROM "Quiz" q
      JOIN "Lesson" l ON q."lessonId" = l."id"
      JOIN "QuizAttempt" qa ON qa."quizId" = q."id"
      WHERE qa."userId" = ${studentId}
      GROUP BY l."subject"
    ` as any[];

    return subjectData.map(subject => ({
      subject: subject.subject,
      totalQuestions: parseInt(subject.total_questions),
      correctAnswers: parseInt(subject.correct_answers),
      accuracy: Math.round(subject.accuracy),
      averageTime: Math.round(subject.average_time || 0),
      improvement: Math.floor(Math.random() * 20) - 10 // Placeholder for improvement calculation
    }));
  }

  private async getTimeDistribution(studentId: string) {
    const timeData = await this.prisma.$queryRaw`
      SELECT 
        l."subject",
        SUM(lp."timeSpent") as total_minutes
      FROM "LessonProgress" lp
      JOIN "Lesson" l ON lp."lessonId" = l."id"
      WHERE lp."userId" = ${studentId}
      GROUP BY l."subject"
    ` as any[];

    const totalMinutes = timeData.reduce((sum, item) => sum + parseInt(item.total_minutes || 0), 0);

    return timeData.map(item => {
      const minutes = parseInt(item.total_minutes || 0);
      return {
        subject: item.subject,
        hours: Math.round(minutes / 60),
        percentage: totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0
      };
    });
  }

  private async getRecentActivities(studentId: string) {
    const [lessonActivities, quizActivities] = await Promise.all([
      this.prisma.lessonProgress.findMany({
        where: { userId: studentId },
        orderBy: { lastAccessed: 'desc' },
        take: 10
      }),
      this.prisma.quizAttempt.findMany({
        where: { userId: studentId },
        orderBy: { attemptDate: 'desc' },
        take: 10
      })
    ]);

    const activities = [
      ...lessonActivities.map(activity => ({
        id: activity.id,
        type: 'lesson' as const,
        title: 'Lesson',
        subject: 'General',
        duration: activity.timeSpent || 0,
        completedAt: activity.lastAccessed.toISOString()
      })),
      ...quizActivities.map(activity => ({
        id: activity.id,
        type: 'quiz' as const,
        title: 'Quiz',
        subject: 'General',
        score: activity.score,
        duration: activity.timeTaken || 0,
        completedAt: activity.attemptDate.toISOString()
      }))
    ];

    return activities
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 15);
  }

  private async getAchievements(studentId: string) {
    const achievements = await this.prisma.userAchievement.findMany({
      where: { userId: studentId },
      orderBy: { unlockedAt: 'desc' }
    });

    return achievements.map(ua => ({
      id: ua.achievementId,
      title: 'Achievement',
      description: 'User achievement',
      earnedAt: ua.unlockedAt.toISOString(),
      category: 'general'
    }));
  }

  private async getWeakAreas(studentId: string) {
    const weakAreas = await this.prisma.$queryRaw`
      SELECT 
        l."subject",
        l."title" as topic,
        AVG(qa."score") as accuracy,
        COUNT(qa."id") as attempts,
        MAX(qa."createdAt") as last_attempt
      FROM "QuizAttempt" qa
      JOIN "Quiz" q ON qa."quizId" = q."id"
      JOIN "Lesson" l ON q."lessonId" = l."id"
      WHERE qa."userId" = ${studentId}
      GROUP BY l."subject", l."title"
      HAVING AVG(qa."score") < 70
      ORDER BY accuracy ASC, attempts DESC
      LIMIT 10
    ` as any[];

    return weakAreas.map(area => ({
      subject: area.subject,
      topic: area.topic,
      accuracy: Math.round(area.accuracy),
      attempts: parseInt(area.attempts),
      lastAttempt: area.last_attempt.toISOString()
    }));
  }

  private async getRecommendations(studentId: string) {
    // Bu kısım AI tabanlı öneriler için genişletilebilir
    const weakAreas = await this.getWeakAreas(studentId);
    
    const recommendations: Recommendation[] = [];
    
    if (weakAreas.length > 0) {
      recommendations.push({
        type: 'practice' as const,
        title: `${weakAreas[0].subject} konusunda pratik yapın`,
        description: `${weakAreas[0].topic} konusunda daha fazla alıştırma yapmanız önerilir.`,
        priority: 'high' as const,
        estimatedTime: 30
      });
    }

    recommendations.push(
      {
        type: 'study_plan' as const,
        title: 'Günlük çalışma planı oluşturun',
        description: 'Düzenli çalışma alışkanlığı geliştirmek için günlük plan yapın.',
        priority: 'medium' as const,
        estimatedTime: 15
      },
      {
        type: 'review' as const,
        title: 'Geçmiş konuları tekrar edin',
        description: 'Öğrenilen konuları pekiştirmek için düzenli tekrar yapın.',
        priority: 'low' as const,
        estimatedTime: 20
      }
    );

    return recommendations;
  }

  private async getStudyStreak(studentId: string) {
    // Basit streak hesaplama - gerçek implementasyon daha karmaşık olabilir
    const recentActivities = await this.prisma.lessonProgress.findMany({
      where: { 
        userId: studentId,
        lastAccessed: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Son 30 gün
        }
      },
      orderBy: { lastAccessed: 'desc' },
      select: { lastAccessed: true }
    });

    // Streak hesaplama mantığı burada olacak
    return {
      current: Math.floor(Math.random() * 10) + 1,
      longest: Math.floor(Math.random() * 20) + 5
    };
  }

  async sendMessageToStudent(parentId: string, studentId: string, message: string, type: string) {
    // Veli-öğrenci bağlantısını doğrula
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        parentId,
        studentId,
        connectionStatus: 'approved'
      }
    });

    if (!connection) {
      throw new Error('Bu öğrenciye mesaj gönderme yetkiniz yok');
    }

    // Bildirim oluştur
    return await this.prisma.notification.create({
      data: {
        senderId: parentId,
        receiverId: studentId,
        title: this.getMessageTitle(type),
        message,
        type: 'PARENT_MESSAGE'
      }
    });
  }

  private getMessageTitle(type: string): string {
    switch (type) {
      case 'encouragement':
        return 'Velinden Teşvik Mesajı';
      case 'suggestion':
        return 'Velinden Öneri';
      case 'reminder':
        return 'Velinden Hatırlatma';
      default:
        return 'Velinden Mesaj';
    }
  }

  async getStudentProgressSummary(parentId: string, studentId: string, period: 'week' | 'month' = 'week') {
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        parentId,
        studentId,
        connectionStatus: 'approved'
      }
    });

    if (!connection) {
      throw new Error('Bu öğrenciye erişim yetkiniz yok');
    }

    const startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const [lessonProgress, quizResults, studyTime] = await Promise.all([
      this.prisma.lessonProgress.count({
        where: {
          userId: studentId,
          completed: true,
          lastAccessed: { gte: startDate }
        }
      }),
      this.prisma.quizAttempt.aggregate({
        where: {
          userId: studentId,
          attemptDate: { gte: startDate }
        },
        _avg: { score: true },
        _count: true
      }),
      this.prisma.lessonProgress.aggregate({
        where: {
          userId: studentId,
          lastAccessed: { gte: startDate }
        },
        _sum: { timeSpent: true }
      })
    ]);

    return {
      period,
      lessonsCompleted: lessonProgress,
      quizzesCompleted: quizResults._count,
      averageQuizScore: Math.round(quizResults._avg?.score || 0),
      totalStudyTime: Math.round((studyTime._sum?.timeSpent || 0) / 60),
      generatedAt: new Date().toISOString()
    };
  }
}