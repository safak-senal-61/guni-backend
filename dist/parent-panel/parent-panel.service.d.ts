import { PrismaService } from '../prisma/prisma.service';
import { ConnectStudentDto, SendNotificationDto, GetStudentDetailedProgressDto } from './parent-panel.dto';
export interface Recommendation {
    type: 'practice' | 'study_plan' | 'review';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number;
}
export interface WeeklyProgress {
    week: string;
    lessonsCompleted: number;
    quizzesCompleted: number;
    studyHours: number;
    averageScore: number;
}
export declare class ParentPanelService {
    private prisma;
    constructor(prisma: PrismaService);
    getParentProfile(parentId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
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
        connectedStudents: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            gradeLevel: import(".prisma/client").$Enums.GradeLevel | null;
            onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        }[];
        totalConnectedStudents: number;
    }>;
    requestStudentConnection(parentId: string, connectDto: ConnectStudentDto): Promise<{
        message: string;
        connection: {
            id: string;
            studentName: string;
            status: string;
        };
    }>;
    getPendingConnections(parentId: string): Promise<{
        id: string;
        student: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
            gradeLevel: import(".prisma/client").$Enums.GradeLevel | null;
        };
        requestedAt: Date;
        inviteCode: string | null;
    }[]>;
    getConnectedStudents(parentId: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        gradeLevel: import(".prisma/client").$Enums.GradeLevel | null;
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        weakSubjects: string[];
        weeklyStats: {
            lessonsCompleted: number;
            quizzesTaken: number;
            averageScore: number;
        };
        connectionApprovedAt: Date | null;
    }[]>;
    getStudentDetailedProgress(parentId: string, dto: GetStudentDetailedProgressDto): Promise<{
        student: {
            id: string | undefined;
            firstName: string | undefined;
            lastName: string | undefined;
            gradeLevel: import(".prisma/client").$Enums.GradeLevel | null | undefined;
            weakSubjects: string[] | undefined;
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
            } | null | undefined;
        };
        statistics: {
            totalLessonsCompleted: number;
            totalQuizzesTaken: number;
            averageQuizScore: number;
            totalStudyTimeMinutes: number;
        };
        recentLessons: {
            id: string;
            lesson: {
                subject: string;
                title: string;
                difficulty: string;
            };
            progress: number;
            timeSpent: number;
            completedAt: Date;
            completed: boolean;
        }[] | undefined;
        recentQuizzes: {
            id: string;
            quiz: {
                subject: string;
                title: string;
                difficulty: string;
                passingScore: number;
            };
            score: number;
            passed: boolean;
            timeTaken: number | null;
            attemptDate: Date;
        }[] | undefined;
        recentAchievements: {
            id: string;
            title: string;
            description: string;
            category: import(".prisma/client").$Enums.AchievementCategory;
            points: number;
            unlockedAt: Date;
        }[] | undefined;
        pagination: {
            page: number;
            limit: number;
            totalLessons: number;
            totalQuizzes: number;
        };
    }>;
    sendNotificationToStudent(parentId: string, dto: SendNotificationDto): Promise<{
        message: string;
        notification: {
            id: string;
            title: string;
            message: string;
            type: string;
            createdAt: Date;
        };
    }>;
    getParentNotifications(parentId: string, page?: number, limit?: number): Promise<{
        notifications: {
            id: string;
            title: string;
            message: string;
            type: string;
            data: import("@prisma/client/runtime/library").JsonValue;
            isRead: boolean;
            createdAt: Date;
            sender: {
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
            } | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        unreadCount: number;
    }>;
    markNotificationAsRead(parentId: string, notificationId: string): Promise<{
        message: string;
    }>;
    generateWeeklyProgressSummary(parentId: string, studentId: string): Promise<{
        id: string;
        weakSubjects: string[];
        createdAt: Date;
        updatedAt: Date;
        achievements: import("@prisma/client/runtime/library").JsonValue | null;
        totalStudyTime: number;
        averageScore: number;
        studentId: string;
        parentId: string;
        weeklyLessons: number;
        weeklyQuizzes: number;
        strongSubjects: string[];
        weekStartDate: Date;
        weekEndDate: Date;
    }>;
    createWeeklyProgressSummary(parentId: string, studentId: string): Promise<{
        id: string;
        weakSubjects: string[];
        createdAt: Date;
        updatedAt: Date;
        achievements: import("@prisma/client/runtime/library").JsonValue | null;
        totalStudyTime: number;
        averageScore: number;
        studentId: string;
        parentId: string;
        weeklyLessons: number;
        weeklyQuizzes: number;
        strongSubjects: string[];
        weekStartDate: Date;
        weekEndDate: Date;
    }>;
    getStudentAnalytics(parentId: string, studentId: string): Promise<{
        overview: {
            totalStudyHours: number;
            totalLessonsCompleted: number;
            totalQuizzesCompleted: number;
            averageScore: number;
            currentStreak: number;
            longestStreak: number;
        };
        weeklyProgress: WeeklyProgress[];
        subjectPerformance: {
            subject: string;
            totalQuestions: any;
            correctAnswers: any;
            accuracy: number;
            averageTime: number;
            improvement: number;
        }[];
        timeDistribution: {
            subject: string;
            hours: number;
            percentage: number;
        }[];
        recentActivities: ({
            id: string;
            type: "lesson";
            title: string;
            subject: string;
            duration: number;
            completedAt: string;
        } | {
            id: string;
            type: "quiz";
            title: string;
            subject: string;
            score: number;
            duration: number;
            completedAt: string;
        })[];
        achievements: {
            id: string;
            title: string;
            description: string;
            unlockedAt: string;
            category: import(".prisma/client").$Enums.AchievementCategory;
        }[];
        weakAreas: {
            subject: string;
            topic: string;
            accuracy: number;
            attempts: number;
            lastAttempt: string;
        }[];
        recommendations: Recommendation[];
    }>;
    sendMessageToStudent(parentId: string, studentId: string, message: string, type: string): Promise<{
        message: string;
        type: string;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        isRead: boolean;
        senderId: string | null;
        receiverId: string;
    }>;
    getDashboardSummary(parentId: string): Promise<{
        connectedStudents: number;
        totalWeeklyLessons: number;
        totalWeeklyQuizzes: number;
        averagePerformance: number;
        students: {
            student: {
                id: string;
                firstName: string;
                lastName: string;
                email: string;
            };
            weeklyStats: {
                lessonsCompleted: number;
                quizzesCompleted: number;
                averageScore: number;
                studyHours: number;
            };
        }[];
    }>;
    getStudentSchedule(parentId: string, studentId: string): Promise<{
        studyPreferences: {
            preferredStudyHours: number;
            learningStyle: string;
            difficultyPreference: string;
        };
        upcomingLessons: {
            id: string;
            title: string;
            subject: string;
            difficulty: string;
            estimatedDuration: number | null;
        }[];
        recommendedQuizzes: {
            id: string;
            title: string;
            subject: string;
            difficulty: string;
            questionCount: number;
        }[];
    }>;
    setStudyGoals(parentId: string, studentId: string, goals: any[]): Promise<{
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
    }>;
}
