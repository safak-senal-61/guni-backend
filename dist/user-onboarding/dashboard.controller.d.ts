import { UserOnboardingService } from './user-onboarding.service';
export declare class DashboardController {
    private readonly userOnboardingService;
    constructor(userOnboardingService: UserOnboardingService);
    getWeaknessesAnalysis(req: any): Promise<{
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
    getProgressTracking(req: any, period?: string): Promise<{
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
    getStudyRecommendations(req: any, focus?: string): Promise<{
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
    getAchievementSummary(req: any): Promise<{
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
    getPersonalizedHomepage(req: any, includeProgress?: boolean, lessonCount?: number): Promise<{
        welcomeMessage: string;
        dailyGoals: {
            title: string;
            subject: string;
            type: string;
            estimatedTime: string;
            priority: string;
        }[];
        weaknessAnalysis: {
            criticalAreas: string[];
            improvementPlan: string[];
            targetScores: {
                [x: string]: string;
            };
        };
        strengthsHighlight: {
            topSubjects: any;
            achievements: string[];
            encouragement: string;
        };
        studyRecommendations: {
            title: string;
            subject: string;
            type: string;
            difficulty: string;
            reason: string;
            estimatedTime: string;
        }[];
        progressTracking: {
            overallProgress: string;
            subjectProgress: any;
            weeklyGoals: string[];
            monthlyTargets: string[];
        };
        chatSuggestions: string[];
    } | {
        personalizedContent: any;
        recommendedLessons: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            subject: string;
            topic: string | null;
            difficulty: string;
            type: import(".prisma/client").$Enums.ContentType;
            duration: number | null;
            content: import("@prisma/client/runtime/library").JsonValue | null;
            thumbnail: string | null;
            tags: string[];
            prerequisites: string[];
            learningObjectives: string[];
        }[];
        recommendedQuizzes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string | null;
            subject: string;
            topic: string | null;
            difficulty: string;
            lessonId: string | null;
            quizType: import(".prisma/client").$Enums.QuizType;
            questionCount: number;
            passingScore: number;
            questions: import("@prisma/client/runtime/library").JsonValue;
        }[];
        progressAnalytics: {
            lessonsProgress: {
                completed: number;
                total: number;
                percentage: number;
            };
            quizzesProgress: {
                taken: number;
                total: number;
                averageScore: number;
            };
        } | null;
        weakSubjectsAnalysis: {
            subjects: string[];
            recommendations: any;
        };
    }>;
}
