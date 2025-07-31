import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getOverallStats(): Promise<{
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
    }>;
    getUserEngagementStats(days?: number): Promise<{
        period: string;
        activeUsers: number;
        lessonCompletions: number;
        quizAttempts: number;
        messagesSent: number;
    }>;
    getLearningProgress(): Promise<{
        avgLessonCompletion: number;
        avgQuizScore: number;
        topPerformers: {
            id: string;
            name: string;
            avgScore: number;
            completedLessons: number;
            overallScore: number;
        }[];
    }>;
    getContentAnalytics(): Promise<{
        popularLessons: ({
            _count: {
                progress: number;
            };
        } & {
            subject: string;
            type: import(".prisma/client").$Enums.ContentType;
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tags: string[];
            content: import("@prisma/client/runtime/library").JsonValue | null;
            duration: number | null;
            difficulty: string;
            learningObjectives: string[];
            topic: string | null;
            thumbnail: string | null;
            prerequisites: string[];
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
    }>;
    getUserActivityTimeline(days?: number): Promise<{
        date: string;
        lessonCompletions: number;
        quizAttempts: number;
        newUsers: number;
        messagesSent: number;
    }[]>;
    getParentEngagement(): Promise<{
        totalConnections: number;
        activeParents: number;
        parentMessages: number;
    }>;
    getAchievementStats(): Promise<{
        totalAchievements: number;
        unlockedAchievements: number;
        topAchievers: {
            userId: string;
            name: string;
            achievementCount: number;
        }[];
    }>;
    private getActiveUsers;
    private getLessonCompletions;
    private getQuizAttempts;
    private getMessagesSent;
    private getAverageLessonCompletion;
    private getAverageQuizScore;
    private getTopPerformers;
    private getPopularLessons;
    private getDifficultQuizzes;
    private getContentByDifficulty;
}
