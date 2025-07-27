import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './notifications.dto';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    createNotification(data: CreateNotificationDto): Promise<{
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
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: {
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
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(notificationId: string, userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    notifyQuizCompleted(userId: string, quizTitle: string, score: number): Promise<{
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
    notifyLessonCompleted(userId: string, lessonTitle: string): Promise<{
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
    notifyAchievementUnlocked(userId: string, achievementTitle: string): Promise<{
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
    notifyParentConnection(userId: string, parentName: string): Promise<{
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
    notifyNewMessage(userId: string, senderName: string): Promise<{
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
}
