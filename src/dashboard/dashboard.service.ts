import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserOnboardingService } from '../user-onboarding/user-onboarding.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private userOnboardingService: UserOnboardingService
  ) {}

  async getWeaknessAnalysis(userId: string) {
    return this.userOnboardingService.generateWeaknessAnalysis(userId);
  }

  async getProgressTracking(userId: string, period: string = 'weekly') {
    return this.userOnboardingService.generateProgressTracking(userId, period);
  }

  async getStudyRecommendations(userId: string, focus: string = 'weaknesses') {
    return this.userOnboardingService.generateStudyRecommendations(userId, focus);
  }

  async getAchievementSummary(userId: string) {
    return this.userOnboardingService.generateAchievementSummary(userId);
  }

  async getPersonalizedHomepage(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Son değerlendirme sonuçlarını al
      const latestAssessment = await this.prisma.assessmentResult.findFirst({
        where: { userId, assessmentType: 'onboarding' },
        orderBy: { createdAt: 'desc' }
      });

      // Quiz denemelerini al
      const recentQuizzes = await this.prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { attemptDate: 'desc' },
        take: 5
      });

      // Eksiklik analizi
      const weaknessAnalysis = await this.getWeaknessAnalysis(userId);
      
      // İlerleme takibi
      const progressTracking = await this.getProgressTracking(userId);
      
      // Çalışma önerileri
      const studyRecommendations = await this.getStudyRecommendations(userId);
      
      // Başarı özeti
      const achievementSummary = await this.getAchievementSummary(userId);

      return {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          gradeLevel: user.gradeLevel,
          weakSubjects: user.weakSubjects || [],
          strongSubjects: (user as any)?.strongSubjects || []
        },
        dashboard: {
          welcomeMessage: `Merhaba ${user.firstName}! Bugün öğrenmeye hazır mısın?`,
          currentDate: new Date().toISOString(),
          
          // Günlük hedefler
          dailyGoals: {
            studyTime: {
              target: 60, // dakika
              completed: progressTracking.activityMetrics?.timeSpent || 0,
              progress: Math.min((progressTracking.activityMetrics?.timeSpent || 0) / 60 * 100, 100)
            },
            quizzes: {
              target: 1,
              completed: recentQuizzes.filter(q => 
                new Date(q.attemptDate).toDateString() === new Date().toDateString()
              ).length,
              progress: recentQuizzes.filter(q => 
                new Date(q.attemptDate).toDateString() === new Date().toDateString()
              ).length >= 1 ? 100 : 0
            },
            subjects: {
              target: 2,
              completed: this.calculateSubjectsStudiedToday(recentQuizzes),
              progress: Math.min(this.calculateSubjectsStudiedToday(recentQuizzes) / 2 * 100, 100)
            }
          },

          // Hızlı istatistikler
          quickStats: {
            totalQuizzes: achievementSummary.overallAchievements?.totalQuizzes || 0,
            averageScore: achievementSummary.overallAchievements?.averageScore || 0,
            studyStreak: progressTracking.activityMetrics?.studyStreak || 0,
            improvementRate: achievementSummary.overallAchievements?.improvementRate || 0
          },

          // Eksiklik özeti
          weaknessOverview: {
            criticalSubjects: weaknessAnalysis.criticalWeaknesses?.subjects?.slice(0, 3) || [],
            priorityLevel: weaknessAnalysis.criticalWeaknesses?.priorityLevel || 'medium',
            nextAction: weaknessAnalysis.actionPlan?.immediate?.[0] || 'Çalışma planını gözden geçir'
          },

          // Güçlü yönler
          strengths: {
            subjects: (achievementSummary as any)?.strengthAreas?.subjects || [],
            skills: (achievementSummary as any)?.strengthAreas?.skills || [],
            recentAchievements: achievementSummary?.recentMilestones?.slice(0, 2) || []
          },

          // Bugünün önerileri
          todayRecommendations: {
            morning: studyRecommendations.dailyPlan?.morning || {
              duration: 30,
              activity: 'Matematik çalışması',
              type: 'study'
            },
            afternoon: studyRecommendations.dailyPlan?.afternoon || {
              duration: 25,
              activity: 'Pratik sorular',
              type: 'practice'
            },
            evening: studyRecommendations.dailyPlan?.evening || {
              duration: 15,
              activity: 'Günün tekrarı',
              type: 'review'
            }
          },

          // İlerleme grafiği
          progressChart: {
            period: 'weekly',
            data: this.generateProgressChartData(recentQuizzes),
            trend: progressTracking.overallProgress?.trend || 'stabil'
          },

          // Motivasyon bölümü
          motivation: {
            dailyQuote: (studyRecommendations as any)?.motivationalElements?.dailyQuote || 
              'Başarı, küçük çabaların günlük tekrarıdır.',
            weeklyChallenge: (studyRecommendations as any)?.motivationalElements?.weeklyChallenge || 
              'Bu hafta 3 yeni konu öğren!',
            encouragement: (achievementSummary as any)?.encouragement?.message || 
              `Harika gidiyorsun ${user.firstName}! Hedeflerine doğru ilerliyorsun.`,
            nextMilestone: {
              title: 'Sonraki Hedef',
              description: (achievementSummary as any)?.nextGoals?.[0]?.description || '3 quiz tamamla',
              progress: (achievementSummary as any)?.nextGoals?.[0]?.progress || 0
            }
          },

          // Hızlı eylemler
          quickActions: [
            {
              title: 'Quiz Çöz',
              description: 'Yeni bir quiz ile kendini test et',
              icon: '📝',
              action: 'start_quiz',
              priority: 'high'
            },
            {
              title: 'AI ile Sohbet',
              description: 'Sorularını AI\'ya sor',
              icon: '🤖',
              action: 'open_chat',
              priority: 'medium'
            },
            {
              title: 'İlerleme Görüntüle',
              description: 'Detaylı ilerleme raporunu incele',
              icon: '📊',
              action: 'view_progress',
              priority: 'medium'
            },
            {
              title: 'Çalışma Planı',
              description: 'Kişiselleştirilmiş çalışma planını gör',
              icon: '📅',
              action: 'view_study_plan',
              priority: 'low'
            }
          ],

          // Son aktiviteler
          recentActivity: recentQuizzes.slice(0, 3).map(quiz => ({
            type: 'quiz',
            title: `${(quiz as any)?.quizType || 'Genel'} Quiz`,
            score: quiz.score,
            date: quiz.attemptDate,
            subject: (quiz as any)?.subject || 'Genel'
          }))
        }
      };

    } catch (error) {
      console.error('Personalized Homepage Error:', error);
      return this.generateFallbackHomepage(userId);
    }
  }

  private calculateSubjectsStudiedToday(quizzes: any[]): number {
    const today = new Date().toDateString();
    const todayQuizzes = quizzes.filter(q => 
      new Date(q.attemptDate).toDateString() === today
    );
    
    const uniqueSubjects = new Set(todayQuizzes.map(q => q.subject || 'Genel'));
    return uniqueSubjects.size;
  }

  private generateProgressChartData(quizzes: any[]) {
    // Son 7 günün verilerini oluştur
    const last7Days: Array<{date: string, score: number, quizCount: number}> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayQuizzes = quizzes.filter(q => 
        new Date(q.attemptDate).toDateString() === date.toDateString()
      );
      
      const averageScore = dayQuizzes.length > 0 
        ? dayQuizzes.reduce((sum, q) => sum + q.score, 0) / dayQuizzes.length
        : 0;
      
      last7Days.push({
        date: date.toISOString().split('T')[0],
        score: Math.round(averageScore),
        quizCount: dayQuizzes.length
      });
    }
    
    return last7Days;
  }

  private async generateFallbackHomepage(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    return {
      user: {
        firstName: user?.firstName || 'Öğrenci',
        lastName: user?.lastName || '',
        gradeLevel: user?.gradeLevel || 'GRADE_8',
        weakSubjects: ['Matematik', 'Fen Bilimleri'],
        strongSubjects: ['Türkçe', 'Sosyal Bilgiler']
      },
      dashboard: {
        welcomeMessage: `Merhaba ${user?.firstName || 'Öğrenci'}! Bugün öğrenmeye hazır mısın?`,
        currentDate: new Date().toISOString(),
        dailyGoals: {
          studyTime: { target: 60, completed: 0, progress: 0 },
          quizzes: { target: 1, completed: 0, progress: 0 },
          subjects: { target: 2, completed: 0, progress: 0 }
        },
        quickStats: {
          totalQuizzes: 0,
          averageScore: 0,
          studyStreak: 0,
          improvementRate: 0
        },
        weaknessOverview: {
          criticalSubjects: ['Matematik', 'Fen Bilimleri'],
          priorityLevel: 'high',
          nextAction: 'Matematik temel konuları çalış'
        },
        motivation: {
          dailyQuote: 'Başarı, küçük çabaların günlük tekrarıdır.',
          encouragement: `Harika gidiyorsun ${user?.firstName || 'Öğrenci'}! Hedeflerine doğru ilerliyorsun.`
        }
      }
    };
  }
}