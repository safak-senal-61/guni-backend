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
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let MessagesService = class MessagesService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async sendMessage(senderId, data) {
        const [sender, receiver] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: senderId } }),
            this.prisma.user.findUnique({ where: { id: data.receiverId } }),
        ]);
        if (!sender || !receiver) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        await this.validateMessagePermission(senderId, data.receiverId);
        const message = await this.prisma.message.create({
            data: {
                content: data.content,
                senderId,
                receiverId: data.receiverId,
                createdAt: new Date(),
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                    },
                },
            },
        });
        await this.notificationsService.notifyNewMessage(data.receiverId, `${sender.firstName} ${sender.lastName}`);
        return message;
    }
    async getConversation(userId, otherUserId, query) {
        await this.validateMessagePermission(userId, otherUserId);
        const skip = ((query.page || 1) - 1) * (query.limit || 10);
        const [messages, total] = await Promise.all([
            this.prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: userId, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: userId },
                    ],
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: query.limit,
            }),
            this.prisma.message.count({
                where: {
                    OR: [
                        { senderId: userId, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: userId },
                    ],
                },
            }),
        ]);
        await this.markMessagesAsRead(userId, otherUserId);
        return {
            messages: messages.reverse(),
            pagination: {
                page: query.page,
                limit: query.limit,
                total,
                totalPages: Math.ceil(total / (query.limit || 10)),
            },
        };
    }
    async getUserConversations(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const conversations = await this.prisma.$queryRaw `
      SELECT DISTINCT
        CASE 
          WHEN m.senderId = ${userId} THEN m.receiverId
          ELSE m.senderId
        END as otherUserId,
        CONCAT(u.firstName, ' ', u.lastName) as otherUserName,
        u.role as otherUserRole,
        latest.content as lastMessage,
        latest.createdAt as lastMessageAt,
        latest.senderId as lastMessageSenderId,
        COALESCE(unread.unreadCount, 0) as unreadCount
      FROM Message m
      INNER JOIN User u ON (
        (m.senderId = ${userId} AND u.id = m.receiverId) OR
        (m.receiverId = ${userId} AND u.id = m.senderId)
      )
      INNER JOIN (
        SELECT 
          CASE 
            WHEN senderId = ${userId} THEN receiverId
            ELSE senderId
          END as otherUserId,
          content,
          createdAt,
          senderId,
          ROW_NUMBER() OVER (
            PARTITION BY CASE 
              WHEN senderId = ${userId} THEN receiverId
              ELSE senderId
            END 
            ORDER BY createdAt DESC
          ) as rn
        FROM Message
        WHERE senderId = ${userId} OR receiverId = ${userId}
      ) latest ON latest.otherUserId = u.id AND latest.rn = 1
      LEFT JOIN (
        SELECT 
          senderId as otherUserId,
          COUNT(*) as unreadCount
        FROM Message
        WHERE receiverId = ${userId} AND readAt IS NULL
        GROUP BY senderId
      ) unread ON unread.otherUserId = u.id
      ORDER BY latest.createdAt DESC
      LIMIT ${limit} OFFSET ${skip}
    `;
        return {
            conversations,
            pagination: {
                page,
                limit,
            },
        };
    }
    async markMessagesAsRead(userId, senderId) {
        return this.prisma.message.updateMany({
            where: {
                receiverId: userId,
                senderId,
                readAt: null,
            },
            data: {
                readAt: new Date(),
            },
        });
    }
    async getUnreadMessageCount(userId) {
        return this.prisma.message.count({
            where: {
                receiverId: userId,
                readAt: null,
            },
        });
    }
    async deleteMessage(messageId, userId) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });
        if (!message) {
            throw new common_1.NotFoundException('Mesaj bulunamadı');
        }
        if (message.senderId !== userId) {
            throw new common_1.ForbiddenException('Bu mesajı silme yetkiniz yok');
        }
        return this.prisma.message.delete({
            where: { id: messageId },
        });
    }
    async validateMessagePermission(userId1, userId2) {
        const [user1, user2] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: userId1 } }),
            this.prisma.user.findUnique({ where: { id: userId2 } }),
        ]);
        if (!user1 || !user2) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (user1.role === client_1.UserRole.ADMIN || user2.role === client_1.UserRole.ADMIN) {
            return true;
        }
        if (user1.role === client_1.UserRole.TEACHER &&
            (user2.role === client_1.UserRole.STUDENT || user2.role === client_1.UserRole.PARENT)) {
            return true;
        }
        if (user2.role === client_1.UserRole.TEACHER &&
            (user1.role === client_1.UserRole.STUDENT || user1.role === client_1.UserRole.PARENT)) {
            return true;
        }
        if (user1.role === client_1.UserRole.PARENT && user2.role === client_1.UserRole.STUDENT) {
            const connection = await this.prisma.parentStudentConnection.findFirst({
                where: {
                    parentId: userId1,
                    studentId: userId2,
                    connectionStatus: 'approved',
                },
            });
            if (connection)
                return true;
        }
        if (user2.role === client_1.UserRole.PARENT && user1.role === client_1.UserRole.STUDENT) {
            const connection = await this.prisma.parentStudentConnection.findFirst({
                where: {
                    parentId: userId2,
                    studentId: userId1,
                    connectionStatus: 'approved',
                },
            });
            if (connection)
                return true;
        }
        throw new common_1.ForbiddenException('Bu kullanıcıyla mesajlaşma yetkiniz yok');
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map