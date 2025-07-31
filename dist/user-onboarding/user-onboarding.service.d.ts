import { PrismaService } from '../prisma/prisma.service';
import { ContentAnalysisService } from '../content-analysis/content-analysis.service';
import { UpdateUserProfileDto, OnboardingQuizDto, SubmitOnboardingQuizDto, PersonalizedHomepageDto } from './user-onboarding.dto';
export declare class UserOnboardingService {
    private readonly prisma;
    private readonly contentAnalysisService;
    private llm;
    constructor(prisma: PrismaService, contentAnalysisService: ContentAnalysisService);
    private cleanJsonResponse;
    updateUserProfile(userId: string, updateData: UpdateUserProfileDto): Promise<{
        user: {
            id: string;
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
            isEmailVerified: boolean;
            emailVerificationToken: string | null;
            emailVerificationExpires: Date | null;
            passwordResetToken: string | null;
            passwordResetExpires: Date | null;
            dateOfBirth: Date | null;
            age: number | null;
            gender: import(".prisma/client").$Enums.Gender | null;
            gradeLevel: import(".prisma/client").$Enums.GradeLevel | null;
            onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
            preferences: import("@prisma/client/runtime/library").JsonValue | null;
            weakSubjects: string[];
            hashedRefreshToken: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            learningStyle: import(".prisma/client").$Enums.LearningStyle | null;
            interests: string[];
            goals: string[];
            studyHours: number | null;
            difficultyPreference: string | null;
            personalizedContent: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    getUserProfile(userId: string): Promise<{
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            learningStyle: import(".prisma/client").$Enums.LearningStyle | null;
            interests: string[];
            goals: string[];
            studyHours: number | null;
            difficultyPreference: string | null;
            personalizedContent: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        id: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        isEmailVerified: boolean;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
        passwordResetToken: string | null;
        passwordResetExpires: Date | null;
        dateOfBirth: Date | null;
        age: number | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        gradeLevel: import(".prisma/client").$Enums.GradeLevel | null;
        preferences: import("@prisma/client/runtime/library").JsonValue | null;
        weakSubjects: string[];
        hashedRefreshToken: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    generateOnboardingQuiz(userId: string, quizData: OnboardingQuizDto): Promise<any>;
    submitOnboardingQuiz(userId: string, quizAnswers: SubmitOnboardingQuizDto): Promise<{
        analysis: any;
        weakSubjects: any;
        strongSubjects: any;
        recommendations: any;
        studyPlan: any;
        personalizedContent: any;
        overallScore: any;
        subjectScores: any;
        learningPath: any;
    }>;
    generatePersonalizedHomepage(userId: string, options: PersonalizedHomepageDto): Promise<{
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
    private createQuizWorkflow;
    private createQuizAnalysisWorkflow;
    private generateFallbackAnalysis;
    generateWeaknessAnalysis(userId: string): Promise<{
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
    generateProgressTracking(userId: string, period?: string): Promise<{
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
    refreshRecommendations(userId: string): Promise<{
        aiRecommendations: any;
        refreshedAt: Date;
        personalizedLessons: {
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
        personalizedQuizzes: {
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
        studyPlan: {
            dailyGoals: string[];
            weeklyTargets: string[];
            prioritySubjects: string[];
        };
    }>;
    generateStudyRecommendations(userId: string, focus?: string): Promise<{
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
    generateAchievementSummary(userId: string): Promise<{
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
    private identifyConceptualGaps;
    private identifySkillDeficits;
    private analyzeStudyHabits;
    private calculateImprovement;
    private calculateTrend;
    private calculateSubjectProgress;
    private calculateAverageScore;
    private calculateStudyStreak;
    private calculateTimeSpent;
    private getWeekEnd;
    private getMonthEnd;
    private generateFallbackWeaknessAnalysis;
    private generateFallbackProgressTracking;
    private generateDailyGoals;
    private generateWeeklyTargets;
    private generateFallbackStudyRecommendations;
    private generateFallbackAchievementSummary;
    private calculatePeriodData;
    private calculateCompletedGoals;
    private getInProgressGoals;
    private getUpcomingGoals;
    private identifyStrengths;
    private identifyImprovements;
    private generateRecommendations;
    private getRecommendedVideos;
    private getRecommendedExercises;
    private getRecommendedQuizzesForSubjects;
    private calculateImprovementRate;
    private identifyStrongSubjects;
    private calculateActiveDays;
    private calculateLongestStreak;
    private calculateTotalStudyTime;
    private createPersonalizedHomepageWorkflow;
    private getRecommendedLessons;
    private getRecommendedQuizzes;
    private getProgressAnalytics;
    private generateFallbackQuiz;
    private generateFallbackHomepage;
    getParentRequests(studentId: string): Promise<({
        parent: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string;
        studentId: string;
        connectionStatus: string;
        inviteCode: string | null;
        requestedAt: Date;
        approvedAt: Date | null;
    })[]>;
    approveParentRequest(studentId: string, connectionId: string): Promise<{
        parent: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string;
        studentId: string;
        connectionStatus: string;
        inviteCode: string | null;
        requestedAt: Date;
        approvedAt: Date | null;
    }>;
    rejectParentRequest(studentId: string, connectionId: string): Promise<{
        message: string;
    }>;
    getConnectedParents(studentId: string): Promise<({
        parent: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string;
        studentId: string;
        connectionStatus: string;
        inviteCode: string | null;
        requestedAt: Date;
        approvedAt: Date | null;
    })[]>;
}
