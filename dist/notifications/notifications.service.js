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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createNotification(data) {
        return this.prisma.notification.create({
            data: {
                title: data.title,
                message: data.message,
                type: data.type,
                receiverId: data.userId,
                senderId: null,
                isRead: false,
                createdAt: new Date(),
            },
        });
    }
    async getUserNotifications(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            this.prisma.notification.findMany({
                where: { receiverId: userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.notification.count({
                where: { receiverId: userId },
            }),
        ]);
        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getUnreadCount(userId) {
        return this.prisma.notification.count({
            where: {
                receiverId: userId,
                isRead: false,
            },
        });
    }
    async markAsRead(notificationId, userId) {
        return this.prisma.notification.updateMany({
            where: {
                id: notificationId,
                receiverId: userId,
            },
            data: {
                isRead: true,
            },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: {
                receiverId: userId,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });
    }
    async deleteNotification(notificationId, userId) {
        return this.prisma.notification.deleteMany({
            where: {
                id: notificationId,
                receiverId: userId,
            },
        });
    }
    async notifyQuizCompleted(userId, quizTitle, score) {
        return this.createNotification({
            title: 'Quiz Tamamlandı',
            message: `"${quizTitle}" quizini tamamladınız. Skorunuz: ${score}%`,
            type: 'QUIZ_COMPLETED',
            userId,
        });
    }
    async notifyLessonCompleted(userId, lessonTitle) {
        return this.createNotification({
            title: 'Ders Tamamlandı',
            message: `"${lessonTitle}" dersini başarıyla tamamladınız!`,
            type: 'LESSON_COMPLETED',
            userId,
        });
    }
    async notifyAchievementUnlocked(userId, achievementTitle) {
        try {
            console.log('Creating achievement notification for user:', userId, 'achievement:', achievementTitle);
            const result = await this.createNotification({
                title: 'Yeni Başarı!',
                message: `"${achievementTitle}" başarısını kazandınız!`,
                type: 'ACHIEVEMENT_UNLOCKED',
                userId,
            });
            console.log('Achievement notification created successfully');
            return result;
        }
        catch (error) {
            console.error('Error creating achievement notification:', error);
            throw error;
        }
    }
    async notifyParentConnection(userId, parentName) {
        return this.createNotification({
            title: 'Ebeveyn Bağlantısı',
            message: `${parentName} sizinle bağlantı kurdu.`,
            type: 'PARENT_CONNECTION',
            userId,
        });
    }
    async notifyNewMessage(userId, senderName) {
        return this.createNotification({
            title: 'Yeni Mesaj',
            message: `${senderName} size bir mesaj gönderdi.`,
            type: 'NEW_MESSAGE',
            userId,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map