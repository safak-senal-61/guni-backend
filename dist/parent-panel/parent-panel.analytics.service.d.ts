import { PrismaService } from '../prisma/prisma.service';
export interface Recommendation {
    type: 'practice' | 'study_plan' | 'review';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number;
}
export declare class ParentPanelAnalyticsService {
    private prisma;
    constructor(prisma: PrismaService);
    getStudentAnalytics(parentId: string, studentId: string): Promise<{
        overview: {
            totalStudyHours: number;
            totalLessonsCompleted: number;
            totalQuizzesCompleted: number;
            averageScore: number;
            currentStreak: number;
            longestStreak: number;
        };
        weeklyProgress: {
            week: any;
            lessonsCompleted: number;
            quizzesCompleted: number;
            studyHours: number;
            averageScore: number;
        }[];
        subjectPerformance: {
            subject: any;
            totalQuestions: number;
            correctAnswers: number;
            accuracy: number;
            averageTime: number;
            improvement: number;
        }[];
        timeDistribution: {
            subject: any;
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
            earnedAt: string;
            category: string;
        }[];
        weakAreas: {
            subject: any;
            topic: any;
            accuracy: number;
            attempts: number;
            lastAttempt: any;
        }[];
        recommendations: Recommendation[];
    }>;
    private getStudentOverview;
    private getWeeklyProgress;
    private getSubjectPerformance;
    private getTimeDistribution;
    private getRecentActivities;
    private getAchievements;
    private getWeakAreas;
    private getRecommendations;
    private getStudyStreak;
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
    private getMessageTitle;
    getStudentProgressSummary(parentId: string, studentId: string, period?: 'week' | 'month'): Promise<{
        period: "week" | "month";
        lessonsCompleted: number;
        quizzesCompleted: number;
        averageQuizScore: number;
        totalStudyTime: number;
        generatedAt: string;
    }>;
}
