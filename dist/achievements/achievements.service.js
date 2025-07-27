"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let AchievementsService = class AchievementsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async createAchievement(data) {
        return this.prisma.achievement.create({
            data: {
                title: data.title,
                description: data.description,
                category: data.category,
                points: data.points,
                icon: data.icon || '',
                requirements: { value: data.requirement },
                rarity: 'common',
            },
        });
    }
    async getAllAchievements() {
        return this.prisma.achievement.findMany({
            orderBy: { points: 'asc' },
        });
    }
    async getUserAchievements(userId) {
        const userAchievements = await this.prisma.userAchievement.findMany({
            where: { userId },
            include: {
                achievement: true,
            },
            orderBy: { unlockedAt: 'desc' },
        });
        const allAchievements = await this.getAllAchievements();
        const unlockedIds = userAchievements.map(ua => ua.achievementId);
        const lockedAchievements = allAchievements.filter(achievement => !unlockedIds.includes(achievement.id));
        return {
            unlocked: userAchievements,
            locked: lockedAchievements,
            totalPoints: userAchievements.reduce((sum, ua) => sum + ua.achievement.points, 0),
            unlockedCount: userAchievements.length,
            totalCount: allAchievements.length,
        };
    }
    async unlockAchievement(userId, achievementId) {
        const existing = await this.prisma.userAchievement.findUnique({
            where: {
                userId_achievementId: {
                    userId,
                    achievementId,
                },
            },
        });
        if (existing) {
            return existing;
        }
        const userAchievement = await this.prisma.userAchievement.create({
            data: {
                userId,
                achievementId,
                unlockedAt: new Date(),
            },
            include: {
                achievement: true,
            },
        });
        await this.notificationsService.notifyAchievementUnlocked(userId, userAchievement.achievement.title);
        return userAchievement;
    }
    async checkAndUnlockAchievements(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    quizzesTaken: true,
                    lessonsCompleted: true,
                    achievements: true,
                },
            });
            if (!user)
                return [];
            const achievements = await this.getAllAchievements();
            const unlockedIds = user.achievements.map(ua => ua.achievementId);
            const availableAchievements = achievements.filter(achievement => !unlockedIds.includes(achievement.id));
            const newUnlocks = [];
            for (const achievement of availableAchievements) {
                let shouldUnlock = false;
                switch (achievement.category) {
                    case client_1.AchievementCategory.PROGRESS:
                        const completedLessons = user.lessonsCompleted.filter(lp => lp.completed).length;
                        const progressReq = typeof achievement.requirements === 'object' ?
                            achievement.requirements.value || 5 :
                            5;
                        shouldUnlock = completedLessons >= progressReq;
                        break;
                    case client_1.AchievementCategory.SUBJECT_MASTERY:
                        const completedQuizzes = user.quizzesTaken.filter(qa => qa.score >= 80).length;
                        const masteryReq = typeof achievement.requirements === 'object' ?
                            achievement.requirements.value || 10 :
                            10;
                        shouldUnlock = completedQuizzes >= masteryReq;
                        break;
                    case client_1.AchievementCategory.GAMIFICATION:
                        const recentProgress = user.lessonsCompleted
                            .filter(lp => lp.completed)
                            .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime());
                        let streak = 0;
                        let currentDate = new Date();
                        for (const progress of recentProgress) {
                            const progressDate = new Date(progress.lastAccessed);
                            const daysDiff = Math.floor((currentDate.getTime() - progressDate.getTime()) / (1000 * 60 * 60 * 24));
                            if (daysDiff <= 1) {
                                streak++;
                                currentDate = progressDate;
                            }
                            else {
                                break;
                            }
                        }
                        const streakReq = typeof achievement.requirements === 'object' ?
                            achievement.requirements.value || 7 :
                            7;
                        shouldUnlock = streak >= streakReq;
                        break;
                    case client_1.AchievementCategory.SPECIAL:
                        const totalPoints = user.achievements.reduce((sum, ua) => {
                            const ach = achievements.find(a => a.id === ua.achievementId);
                            return sum + (ach?.points || 0);
                        }, 0);
                        const specialReq = typeof achievement.requirements === 'object' ?
                            achievement.requirements.value || 1000 :
                            1000;
                        shouldUnlock = totalPoints >= specialReq;
                        break;
                }
                if (shouldUnlock) {
                    const newAchievement = await this.unlockAchievement(userId, achievement.id);
                    newUnlocks.push(newAchievement);
                }
            }
            return newUnlocks;
        }
        catch (error) {
            console.error('Error in checkAndUnlockAchievements:', error);
            throw error;
        }
    }
    async getUserLeaderboard(limit = 10) {
        const users = await this.prisma.user.findMany({
            include: {
                achievements: {
                    include: {
                        achievement: true,
                    },
                },
            },
        });
        const leaderboard = users.map(user => {
            const totalPoints = user.achievements.reduce((sum, ua) => sum + ua.achievement.points, 0);
            return {
                userId: user.id,
                name: `${user.firstName} ${user.lastName}`,
                totalPoints,
                achievementCount: user.achievements.length,
            };
        });
        return leaderboard
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .slice(0, limit);
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map