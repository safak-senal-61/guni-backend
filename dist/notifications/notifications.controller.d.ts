import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, GetNotificationsDto } from './notifications.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    createNotification(createNotificationDto: CreateNotificationDto): Promise<{
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
    getUserNotifications(req: any, query: GetNotificationsDto): Promise<{
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
    getUnreadCount(req: any): Promise<number>;
    markAsRead(id: string, req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markAllAsRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteNotification(id: string, req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
