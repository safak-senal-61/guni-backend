import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './achievements.dto';
export declare class AchievementsController {
    private readonly achievementsService;
    constructor(achievementsService: AchievementsService);
    createAchievement(createAchievementDto: CreateAchievementDto): Promise<{
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
    getUserAchievements(req: any): Promise<{
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
    checkAndUnlockAchievements(req: any): Promise<any[]>;
    getLeaderboard(limit?: string): Promise<{
        userId: string;
        name: string;
        totalPoints: number;
        achievementCount: number;
    }[]>;
    unlockAchievement(achievementId: string, userId: string): Promise<{
        id: string;
        userId: string;
        progress: import("@prisma/client/runtime/library").JsonValue | null;
        achievementId: string;
        unlockedAt: Date;
    }>;
}
