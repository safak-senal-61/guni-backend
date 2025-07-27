import { UserOnboardingService } from './user-onboarding.service';
import { UpdateUserProfileDto, OnboardingQuizDto, SubmitOnboardingQuizDto, PersonalizedHomepageDto } from './user-onboarding.dto';
export declare class UserOnboardingController {
    private readonly userOnboardingService;
    constructor(userOnboardingService: UserOnboardingService);
    updateProfile(req: any, updateData: UpdateUserProfileDto): Promise<{
        user: {
            email: string;
            password: string;
            firstName: string;
            lastName: string;
            id: string;
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
        recommendations: any;
    }>;
    generatePersonalizedHomepage(req: any, options: PersonalizedHomepageDto): Promise<{
        personalizedContent: any;
        recommendedLessons: {
            type: import(".prisma/client").$Enums.ContentType;
            description: string | null;
            title: string;
            subject: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            content: import("@prisma/client/runtime/library").JsonValue | null;
            duration: number | null;
            difficulty: string;
            topic: string | null;
            thumbnail: string | null;
            prerequisites: string[];
            learningObjectives: string[];
        }[];
        recommendedQuizzes: {
            description: string | null;
            title: string;
            subject: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questions: import("@prisma/client/runtime/library").JsonValue;
            difficulty: string;
            topic: string | null;
            lessonId: string | null;
            quizType: import(".prisma/client").$Enums.QuizType;
            questionCount: number;
            passingScore: number;
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
        personalizedContent: any;
        recommendedLessons: {
            type: import(".prisma/client").$Enums.ContentType;
            description: string | null;
            title: string;
            subject: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            content: import("@prisma/client/runtime/library").JsonValue | null;
            duration: number | null;
            difficulty: string;
            topic: string | null;
            thumbnail: string | null;
            prerequisites: string[];
            learningObjectives: string[];
        }[];
        recommendedQuizzes: {
            description: string | null;
            title: string;
            subject: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questions: import("@prisma/client/runtime/library").JsonValue;
            difficulty: string;
            topic: string | null;
            lessonId: string | null;
            quizType: import(".prisma/client").$Enums.QuizType;
            questionCount: number;
            passingScore: number;
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
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        id: string;
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
        personalizedContent: any;
        recommendedLessons: {
            type: import(".prisma/client").$Enums.ContentType;
            description: string | null;
            title: string;
            subject: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            content: import("@prisma/client/runtime/library").JsonValue | null;
            duration: number | null;
            difficulty: string;
            topic: string | null;
            thumbnail: string | null;
            prerequisites: string[];
            learningObjectives: string[];
        }[];
        recommendedQuizzes: {
            description: string | null;
            title: string;
            subject: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            questions: import("@prisma/client/runtime/library").JsonValue;
            difficulty: string;
            topic: string | null;
            lessonId: string | null;
            quizType: import(".prisma/client").$Enums.QuizType;
            questionCount: number;
            passingScore: number;
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
    getWeakSubjectsAnalysis(req: any): Promise<{
        weakSubjectsAnalysis: {
            subjects: string[];
            recommendations: any;
        };
        aiRecommendations: any;
    }>;
    getParentRequests(req: any): Promise<({
        parent: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        inviteCode: string | null;
        studentId: string;
        connectionStatus: string;
        parentId: string;
        requestedAt: Date;
        approvedAt: Date | null;
    })[]>;
    approveParentRequest(req: any, connectionId: string): Promise<{
        parent: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        inviteCode: string | null;
        studentId: string;
        connectionStatus: string;
        parentId: string;
        requestedAt: Date;
        approvedAt: Date | null;
    }>;
    rejectParentRequest(req: any, connectionId: string): Promise<{
        message: string;
    }>;
    getConnectedParents(req: any): Promise<({
        parent: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        inviteCode: string | null;
        studentId: string;
        connectionStatus: string;
        parentId: string;
        requestedAt: Date;
        approvedAt: Date | null;
    })[]>;
}
