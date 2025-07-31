"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const user_onboarding_service_1 = require("../user-onboarding/user-onboarding.service");
let DashboardService = class DashboardService {
    prisma;
    userOnboardingService;
    constructor(prisma, userOnboardingService) {
        this.prisma = prisma;
        this.userOnboardingService = userOnboardingService;
    }
    async getWeaknessAnalysis(userId) {
        return this.userOnboardingService.generateWeaknessAnalysis(userId);
    }
    async getProgressTracking(userId, period = 'weekly') {
        return this.userOnboardingService.generateProgressTracking(userId, period);
    }
    async getStudyRecommendations(userId, focus = 'weaknesses') {
        return this.userOnboardingService.generateStudyRecommendations(userId, focus);
    }
    async getAchievementSummary(userId) {
        return this.userOnboardingService.generateAchievementSummary(userId);
    }
    async getPersonalizedHomepage(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { profile: true }
            });
            if (!user) {
                throw new Error('User not found');
            }
            const latestAssessment = await this.prisma.assessmentResult.findFirst({
                where: { userId, assessmentType: 'onboarding' },
                orderBy: { createdAt: 'desc' }
            });
            const recentQuizzes = await this.prisma.quizAttempt.findMany({
                where: { userId },
                orderBy: { attemptDate: 'desc' },
                take: 5
            });
            const weaknessAnalysis = await this.getWeaknessAnalysis(userId);
            const progressTracking = await this.getProgressTracking(userId);
            const studyRecommendations = await this.getStudyRecommendations(userId);
            const achievementSummary = await this.getAchievementSummary(userId);
            return {
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gradeLevel: user.gradeLevel,
                    weakSubjects: user.weakSubjects || [],
                    strongSubjects: user?.strongSubjects || []
                },
                dashboard: {
                    welcomeMessage: `Merhaba ${user.firstName}! Bugün öğrenmeye hazır mısın?`,
                    currentDate: new Date().toISOString(),
                    dailyGoals: {
                        studyTime: {
                            target: 60,
                            completed: progressTracking.activityMetrics?.timeSpent || 0,
                            progress: Math.min((progressTracking.activityMetrics?.timeSpent || 0) / 60 * 100, 100)
                        },
                        quizzes: {
                            target: 1,
                            completed: recentQuizzes.filter(q => new Date(q.attemptDate).toDateString() === new Date().toDateString()).length,
                            progress: recentQuizzes.filter(q => new Date(q.attemptDate).toDateString() === new Date().toDateString()).length >= 1 ? 100 : 0
                        },
                        subjects: {
                            target: 2,
                            completed: this.calculateSubjectsStudiedToday(recentQuizzes),
                            progress: Math.min(this.calculateSubjectsStudiedToday(recentQuizzes) / 2 * 100, 100)
                        }
                    },
                    quickStats: {
                        totalQuizzes: achievementSummary.overallAchievements?.totalQuizzes || 0,
                        averageScore: achievementSummary.overallAchievements?.averageScore || 0,
                        studyStreak: progressTracking.activityMetrics?.studyStreak || 0,
                        improvementRate: achievementSummary.overallAchievements?.improvementRate || 0
                    },
                    weaknessOverview: {
                        criticalSubjects: weaknessAnalysis.criticalWeaknesses?.subjects?.slice(0, 3) || [],
                        priorityLevel: weaknessAnalysis.criticalWeaknesses?.priorityLevel || 'medium',
                        nextAction: weaknessAnalysis.actionPlan?.immediate?.[0] || 'Çalışma planını gözden geçir'
                    },
                    strengths: {
                        subjects: achievementSummary?.strengthAreas?.subjects || [],
                        skills: achievementSummary?.strengthAreas?.skills || [],
                        recentAchievements: achievementSummary?.recentMilestones?.slice(0, 2) || []
                    },
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
                    progressChart: {
                        period: 'weekly',
                        data: this.generateProgressChartData(recentQuizzes),
                        trend: progressTracking.overallProgress?.trend || 'stabil'
                    },
                    motivation: {
                        dailyQuote: studyRecommendations?.motivationalElements?.dailyQuote ||
                            'Başarı, küçük çabaların günlük tekrarıdır.',
                        weeklyChallenge: studyRecommendations?.motivationalElements?.weeklyChallenge ||
                            'Bu hafta 3 yeni konu öğren!',
                        encouragement: achievementSummary?.encouragement?.message ||
                            `Harika gidiyorsun ${user.firstName}! Hedeflerine doğru ilerliyorsun.`,
                        nextMilestone: {
                            title: 'Sonraki Hedef',
                            description: achievementSummary?.nextGoals?.[0]?.description || '3 quiz tamamla',
                            progress: achievementSummary?.nextGoals?.[0]?.progress || 0
                        }
                    },
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
                    recentActivity: recentQuizzes.slice(0, 3).map(quiz => ({
                        type: 'quiz',
                        title: `${quiz?.quizType || 'Genel'} Quiz`,
                        score: quiz.score,
                        date: quiz.attemptDate,
                        subject: quiz?.subject || 'Genel'
                    }))
                }
            };
        }
        catch (error) {
            console.error('Personalized Homepage Error:', error);
            return this.generateFallbackHomepage(userId);
        }
    }
    calculateSubjectsStudiedToday(quizzes) {
        const today = new Date().toDateString();
        const todayQuizzes = quizzes.filter(q => new Date(q.attemptDate).toDateString() === today);
        const uniqueSubjects = new Set(todayQuizzes.map(q => q.subject || 'Genel'));
        return uniqueSubjects.size;
    }
    generateProgressChartData(quizzes) {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayQuizzes = quizzes.filter(q => new Date(q.attemptDate).toDateString() === date.toDateString());
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
    async generateFallbackHomepage(userId) {
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_onboarding_service_1.UserOnboardingService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map