import { AnalyticsService } from './analytics.service';
import { GetAnalyticsDto, GetTimelineDto, GetTopPerformersDto, GetPopularContentDto } from './analytics.dto';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getOverview(): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            totalLessons: number;
            totalQuizzes: number;
            totalMessages: number;
            usersByRole: {
                students: number;
                teachers: number;
                parents: number;
                admins: number;
            };
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getUserEngagement(query: GetAnalyticsDto): Promise<{
        success: boolean;
        data: {
            period: string;
            activeUsers: number;
            lessonCompletions: number;
            quizAttempts: number;
            messagesSent: number;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getLearningProgress(): Promise<{
        success: boolean;
        data: {
            avgLessonCompletion: number;
            avgQuizScore: number;
            topPerformers: {
                id: string;
                name: string;
                avgScore: number;
                completedLessons: number;
                overallScore: number;
            }[];
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getContentAnalytics(): Promise<{
        success: boolean;
        data: {
            popularLessons: ({
                _count: {
                    progress: number;
                };
            } & {
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
            })[];
            difficultQuizzes: {
                id: string;
                title: string;
                difficulty: string;
                averageScore: number;
                attemptCount: number;
            }[];
            contentByDifficulty: {
                lessons: {
                    beginner: number;
                    intermediate: number;
                    advanced: number;
                };
                quizzes: {
                    beginner: number;
                    intermediate: number;
                    advanced: number;
                };
            };
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getActivityTimeline(query: GetTimelineDto): Promise<{
        success: boolean;
        data: {
            date: string;
            lessonCompletions: number;
            quizAttempts: number;
            newUsers: number;
            messagesSent: number;
        }[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getParentEngagement(): Promise<{
        success: boolean;
        data: {
            totalConnections: number;
            activeParents: number;
            parentMessages: number;
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getAchievementStats(): Promise<{
        success: boolean;
        data: {
            totalAchievements: number;
            unlockedAchievements: number;
            topAchievers: {
                userId: string;
                name: string;
                achievementCount: number;
            }[];
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getTopPerformers(query: GetTopPerformersDto): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            avgScore: number;
            completedLessons: number;
            overallScore: number;
        }[];
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
    getPopularContent(query: GetPopularContentDto): Promise<{
        success: boolean;
        data: {
            popularLessons: ({
                _count: {
                    progress: number;
                };
            } & {
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
            })[];
            difficultQuizzes: {
                id: string;
                title: string;
                difficulty: string;
                averageScore: number;
                attemptCount: number;
            }[];
        };
        message?: undefined;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        data?: undefined;
    }>;
}
