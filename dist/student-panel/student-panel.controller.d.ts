import { StudentPanelService } from './student-panel.service';
export declare class StudentPanelController {
    private readonly studentPanelService;
    constructor(studentPanelService: StudentPanelService);
    getDashboard(req: any): Promise<{
        user: {
            id: string;
            name: string;
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
        };
        progress: {
            overview: {
                totalLessons: number;
                completedLessons: number;
                totalQuizzes: number;
                completedQuizzes: number;
                lessonCompletionRate: number;
                quizSuccessRate: number;
            };
            recentLessons: ({
                lesson: {
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
                };
            } & {
                id: string;
                createdAt: Date;
                userId: string;
                completed: boolean;
                progress: number;
                lessonId: string;
                timeSpent: number;
                lastAccessed: Date;
            })[];
        };
        recentQuizzes: ({
            quiz: {
                title: string;
                id: string;
                difficulty: string;
            };
        } & {
            id: string;
            userId: string;
            completed: boolean;
            quizId: string;
            score: number;
            answers: import("@prisma/client/runtime/library").JsonValue;
            timeTaken: number | null;
            attemptDate: Date;
        })[];
        achievements: {
            unlocked: ({
                achievement: {
                    description: string;
                    title: string;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    category: import(".prisma/client").$Enums.AchievementCategory;
                    points: number;
                    icon: string;
                    rarity: string;
                    requirements: import("@prisma/client/runtime/library").JsonValue;
                };
            } & {
                id: string;
                userId: string;
                progress: import("@prisma/client/runtime/library").JsonValue | null;
                achievementId: string;
                unlockedAt: Date;
            })[];
            locked: {
                description: string;
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                category: import(".prisma/client").$Enums.AchievementCategory;
                points: number;
                icon: string;
                rarity: string;
                requirements: import("@prisma/client/runtime/library").JsonValue;
            }[];
            totalPoints: number;
            unlockedCount: number;
            totalCount: number;
        };
        recentNotifications: {
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
        }[];
    }>;
    getProgress(req: any): Promise<{
        overview: {
            totalLessons: number;
            completedLessons: number;
            totalQuizzes: number;
            completedQuizzes: number;
            lessonCompletionRate: number;
            quizSuccessRate: number;
        };
        recentLessons: ({
            lesson: {
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
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            completed: boolean;
            progress: number;
            lessonId: string;
            timeSpent: number;
            lastAccessed: Date;
        })[];
    }>;
    getStats(req: any): Promise<{
        totalStudyTime: number;
        averageScore: number;
        currentStreak: number;
        longestStreak: number;
        weeklyProgress: {
            lessonsCompleted: number;
            quizzesAttempted: number;
        };
    }>;
    getUpcomingLessons(req: any, limit?: string): Promise<{
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
    }[]>;
    getRecommendedQuizzes(req: any, limit?: string): Promise<{
        subject: string;
        description: string | null;
        title: string;
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
    }[]>;
    getRecentQuizResults(req: any, limit?: string): Promise<({
        quiz: {
            title: string;
            id: string;
            difficulty: string;
        };
    } & {
        id: string;
        userId: string;
        completed: boolean;
        quizId: string;
        score: number;
        answers: import("@prisma/client/runtime/library").JsonValue;
        timeTaken: number | null;
        attemptDate: Date;
    })[]>;
}
