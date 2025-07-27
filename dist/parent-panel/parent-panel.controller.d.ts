import { ParentPanelService } from './parent-panel.service';
import { ParentPanelAnalyticsService } from './parent-panel.analytics.service';
import { ConnectStudentDto, SendNotificationDto } from './parent-panel.dto';
export declare class ParentPanelController {
    private readonly parentPanelService;
    private readonly analyticsService;
    constructor(parentPanelService: ParentPanelService, analyticsService: ParentPanelAnalyticsService);
    getProfile(req: any): Promise<{
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
    connectStudent(req: any, connectDto: ConnectStudentDto): Promise<{
        message: string;
        connection: {
            id: string;
            studentName: string;
            status: string;
        };
    }>;
    getPendingConnections(req: any): Promise<{
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
    getConnectedStudents(req: any): Promise<{
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
    getStudentDetailedProgress(req: any, studentId: string, subject?: string, page?: string, limit?: string): Promise<{
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
                title: string;
                subject: string;
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
                title: string;
                subject: string;
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
    getStudentAnalytics(req: any, studentId: string): Promise<{
        overview: {
            totalStudyHours: number;
            totalLessonsCompleted: number;
            totalQuizzesCompleted: number;
            averageScore: number;
            currentStreak: number;
            longestStreak: number;
        };
        weeklyProgress: import("./parent-panel.service").WeeklyProgress[];
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
        recommendations: import("./parent-panel.service").Recommendation[];
    }>;
    sendMessageToStudent(req: any, body: {
        studentId: string;
        message: string;
        type: string;
    }): Promise<{
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
    getDashboardSummary(req: any): Promise<{
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
    getStudentSchedule(req: any, studentId: string): Promise<{
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
    setStudyGoals(req: any, body: {
        studentId: string;
        goals: any[];
    }): Promise<{
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
    sendNotification(req: any, notificationDto: SendNotificationDto): Promise<{
        message: string;
        notification: {
            id: string;
            title: string;
            message: string;
            type: string;
            createdAt: Date;
        };
    }>;
    getNotifications(req: any, page?: string, limit?: string): Promise<{
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
    markNotificationAsRead(req: any, notificationId: string): Promise<{
        message: string;
    }>;
    generateWeeklySummary(req: any, studentId: string): Promise<{
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
    getStudentProgressSummary(req: any, studentId: string, period?: 'week' | 'month'): Promise<{
        period: "week" | "month";
        lessonsCompleted: number;
        quizzesCompleted: number;
        averageQuizScore: number;
        totalStudyTime: number;
        generatedAt: string;
    }>;
    getDashboardStats(req: any): Promise<{
        period: "week" | "month";
        lessonsCompleted: number;
        quizzesCompleted: number;
        averageQuizScore: number;
        totalStudyTime: number;
        generatedAt: string;
        studentId: string;
        studentName: string;
    }[]>;
}
