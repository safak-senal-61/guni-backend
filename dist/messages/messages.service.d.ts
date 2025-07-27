import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateMessageDto, GetMessagesDto } from './messages.dto';
export declare class MessagesService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    sendMessage(senderId: string, data: CreateMessageDto): Promise<{
        sender: {
            firstName: string;
            lastName: string;
            id: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    } & {
        attachments: string[];
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        receiverId: string | null;
        groupId: string | null;
        messageType: import(".prisma/client").$Enums.MessageType;
        readAt: Date | null;
    }>;
    getConversation(userId: string, otherUserId: string, query: GetMessagesDto): Promise<{
        messages: ({
            sender: {
                firstName: string;
                lastName: string;
                id: string;
                role: import(".prisma/client").$Enums.UserRole;
            };
        } & {
            attachments: string[];
            id: string;
            createdAt: Date;
            content: string;
            senderId: string;
            receiverId: string | null;
            groupId: string | null;
            messageType: import(".prisma/client").$Enums.MessageType;
            readAt: Date | null;
        })[];
        pagination: {
            page: number | undefined;
            limit: number | undefined;
            total: number;
            totalPages: number;
        };
    }>;
    getUserConversations(userId: string, page?: number, limit?: number): Promise<{
        conversations: unknown;
        pagination: {
            page: number;
            limit: number;
        };
    }>;
    markMessagesAsRead(userId: string, senderId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnreadMessageCount(userId: string): Promise<number>;
    deleteMessage(messageId: string, userId: string): Promise<{
        attachments: string[];
        id: string;
        createdAt: Date;
        content: string;
        senderId: string;
        receiverId: string | null;
        groupId: string | null;
        messageType: import(".prisma/client").$Enums.MessageType;
        readAt: Date | null;
    }>;
    private validateMessagePermission;
}
