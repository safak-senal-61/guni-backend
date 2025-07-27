import { AchievementCategory } from '@prisma/client';
export declare class CreateAchievementDto {
    title: string;
    description: string;
    category: AchievementCategory;
    points: number;
    icon?: string;
    requirement: number;
}
export declare class UpdateAchievementDto {
    title?: string;
    description?: string;
    category?: AchievementCategory;
    points?: number;
    icon?: string;
    requirement?: number;
    isActive?: boolean;
}
