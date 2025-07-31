import { UserOnboardingService } from './user-onboarding.service';
import { UpdateUserProfileDto, OnboardingQuizDto, SubmitOnboardingQuizDto, PersonalizedHomepageDto } from './user-onboarding.dto';
export declare class UserOnboardingController {
    private readonly userOnboardingService;
    constructor(userOnboardingService: UserOnboardingService);
    updateProfile(req: any, updateData: UpdateUserProfileDto): Promise<{
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
    generateOnboardingQuiz(req: any, quizData: OnboardingQuizDto): Promise<any>;
    submitOnboardingQuiz(req: any, quizAnswers: SubmitOnboardingQuizDto): Promise<{
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
    generatePersonalizedHomepage(req: any, options: PersonalizedHomepageDto): Promise<{
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
    getPersonalizedHomepage(req: any): Promise<{
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
    refreshRecommendations(req: any): Promise<{
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
    getWeakSubjectsAnalysis(req: any): Promise<{
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
    getParentRequests(req: any): Promise<({
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
    approveParentRequest(req: any, connectionId: string): Promise<{
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
    rejectParentRequest(req: any, connectionId: string): Promise<{
        message: string;
    }>;
    getConnectedParents(req: any): Promise<({
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
