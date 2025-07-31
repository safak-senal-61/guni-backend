import { PrismaService } from '../prisma/prisma.service';
import { UserOnboardingService } from '../user-onboarding/user-onboarding.service';
export declare class DashboardService {
    private prisma;
    private userOnboardingService;
    constructor(prisma: PrismaService, userOnboardingService: UserOnboardingService);
    getWeaknessAnalysis(userId: string): Promise<{
        criticalWeaknesses: {
            subjects: string[];
            scores: {
                Matematik: number;
                'Fen Bilimleri': number;
            };
            priorityLevel: string;
        };
        improvementAreas: {
            conceptualGaps: string[];
            skillDeficits: string[];
            studyHabits: string[];
        };
        actionPlan: {
            immediate: string[];
            shortTerm: string[];
            longTerm: string[];
        };
    } | {
        aiAnalysis: any;
        criticalWeaknesses: {
            subjects: string[];
            scores: any;
            priorityLevel: string;
        };
        improvementAreas: {
            conceptualGaps: string[];
            skillDeficits: string[];
            studyHabits: string[];
        };
        actionPlan: {
            immediate: string[];
            shortTerm: string[];
            longTerm: string[];
        };
        targetMetrics: {
            weeklyGoals: {
                studyHours: number;
                quizzesCompleted: number;
                improvementPercentage: number;
            };
            monthlyTargets: {
                overallScore: number;
                weakestSubjectScore: number;
                consistencyRate: number;
            };
        };
    }>;
    getProgressTracking(userId: string, period?: string): Promise<{
        currentPeriod: string;
        overallProgress: {
            currentScore: number;
            previousScore: number;
            improvement: number;
            trend: string;
        };
        activityMetrics: {
            quizzesCompleted: number;
            averageScore: number;
            studyStreak: number;
            timeSpent: number;
        };
    } | {
        currentPeriod: string;
        overallProgress: {
            currentScore: number;
            previousScore: number;
            improvement: number;
            trend: string;
        };
        subjectProgress: any;
        activityMetrics: {
            quizzesCompleted: number;
            averageScore: number;
            studyStreak: number;
            timeSpent: number;
        };
        goals: {
            completed: never[];
            inProgress: never[];
            upcoming: never[];
        };
        insights: {
            strengths: string[];
            improvements: string[];
            recommendations: string[];
        };
    }>;
    getStudyRecommendations(userId: string, focus?: string): Promise<{
        focusArea: string;
        prioritySubjects: string[];
        dailyPlan: {
            morning: {
                duration: number;
                activity: string;
                type: string;
            };
            afternoon: {
                duration: number;
                activity: string;
                type: string;
            };
            evening: {
                duration: number;
                activity: string;
                type: string;
            };
        };
    } | {
        focusArea: string;
        prioritySubjects: string[];
        dailyPlan: {
            morning: {
                duration: number;
                activity: string;
                type: string;
            };
            afternoon: {
                duration: number;
                activity: string;
                type: string;
            };
            evening: {
                duration: number;
                activity: string;
                type: string;
            };
        };
        weeklyPlan: {
            monday: string;
            tuesday: string;
            wednesday: string;
            thursday: string;
            friday: string;
            saturday: string;
            sunday: string;
        };
        studyTechniques: {
            name: string;
            description: string;
            bestFor: string;
        }[];
        resources: {
            videos: never[];
            exercises: never[];
            quizzes: never[];
        };
        motivationalElements: {
            dailyQuote: string;
            weeklyChallenge: string;
            rewardSystem: {
                daily: string;
                weekly: string;
                monthly: string;
            };
        };
    }>;
    getAchievementSummary(userId: string): Promise<{
        overallAchievements: {
            totalQuizzes: number;
            averageScore: number;
            bestScore: number;
            improvementRate: number;
        };
        recentMilestones: {
            title: string;
            date: Date;
            description: string;
            icon: string;
        }[];
    } | {
        overallAchievements: {
            totalQuizzes: number;
            averageScore: number;
            bestScore: number;
            improvementRate: number;
        };
        recentMilestones: {
            title: string;
            date: Date;
            description: string;
            icon: string;
        }[];
        strengthAreas: {
            subjects: string[];
            skills: string[];
            learningStyle: any;
        };
        motivationalStats: {
            daysActive: number;
            longestStreak: number;
            totalStudyTime: any;
            rank: string;
        };
        nextGoals: {
            title: string;
            description: string;
            progress: number;
            deadline: Date;
        }[];
        encouragement: {
            message: string;
            tip: string;
            nextAction: string;
        };
    }>;
    getPersonalizedHomepage(userId: string): Promise<{
        user: {
            firstName: string;
            lastName: string;
            gradeLevel: import(".prisma/client").$Enums.GradeLevel;
            weakSubjects: string[];
            strongSubjects: string[];
        };
        dashboard: {
            welcomeMessage: string;
            currentDate: string;
            dailyGoals: {
                studyTime: {
                    target: number;
                    completed: number;
                    progress: number;
                };
                quizzes: {
                    target: number;
                    completed: number;
                    progress: number;
                };
                subjects: {
                    target: number;
                    completed: number;
                    progress: number;
                };
            };
            quickStats: {
                totalQuizzes: number;
                averageScore: number;
                studyStreak: number;
                improvementRate: number;
            };
            weaknessOverview: {
                criticalSubjects: string[];
                priorityLevel: string;
                nextAction: string;
            };
            motivation: {
                dailyQuote: string;
                encouragement: string;
            };
        };
    } | {
        user: {
            firstName: string;
            lastName: string;
            gradeLevel: import(".prisma/client").$Enums.GradeLevel | null;
            weakSubjects: string[];
            strongSubjects: any;
        };
        dashboard: {
            welcomeMessage: string;
            currentDate: string;
            dailyGoals: {
                studyTime: {
                    target: number;
                    completed: number;
                    progress: number;
                };
                quizzes: {
                    target: number;
                    completed: number;
                    progress: number;
                };
                subjects: {
                    target: number;
                    completed: number;
                    progress: number;
                };
            };
            quickStats: {
                totalQuizzes: number;
                averageScore: number;
                studyStreak: number;
                improvementRate: number;
            };
            weaknessOverview: {
                criticalSubjects: string[];
                priorityLevel: string;
                nextAction: string;
            };
            strengths: {
                subjects: any;
                skills: any;
                recentAchievements: {
                    title: string;
                    date: Date;
                    description: string;
                    icon: string;
                }[];
            };
            todayRecommendations: {
                morning: {
                    duration: number;
                    activity: string;
                    type: string;
                } | {
                    duration: number;
                    activity: string;
                    type: string;
                };
                afternoon: {
                    duration: number;
                    activity: string;
                    type: string;
                } | {
                    duration: number;
                    activity: string;
                    type: string;
                };
                evening: {
                    duration: number;
                    activity: string;
                    type: string;
                } | {
                    duration: number;
                    activity: string;
                    type: string;
                };
            };
            progressChart: {
                period: string;
                data: {
                    date: string;
                    score: number;
                    quizCount: number;
                }[];
                trend: string;
            };
            motivation: {
                dailyQuote: any;
                weeklyChallenge: any;
                encouragement: any;
                nextMilestone: {
                    title: string;
                    description: any;
                    progress: any;
                };
            };
            quickActions: {
                title: string;
                description: string;
                icon: string;
                action: string;
                priority: string;
            }[];
            recentActivity: {
                type: string;
                title: string;
                score: number;
                date: Date;
                subject: any;
            }[];
        };
    }>;
    private calculateSubjectsStudiedToday;
    private generateProgressChartData;
    private generateFallbackHomepage;
}
