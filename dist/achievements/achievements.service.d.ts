import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateAchievementDto } from './achievements.dto';
export declare class AchievementsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createAchievement(data: CreateAchievementDto): Promise<{
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
    }>;
    getAllAchievements(): Promise<{
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
    }[]>;
    getUserAchievements(userId: string): Promise<{
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
    }>;
    unlockAchievement(userId: string, achievementId: string): Promise<{
        id: string;
        userId: string;
        progress: import("@prisma/client/runtime/library").JsonValue | null;
        achievementId: string;
        unlockedAt: Date;
    }>;
    checkAndUnlockAchievements(userId: string): Promise<any[]>;
    getUserLeaderboard(limit?: number): Promise<{
        userId: string;
        name: string;
        totalPoints: number;
        achievementCount: number;
    }[]>;
}
