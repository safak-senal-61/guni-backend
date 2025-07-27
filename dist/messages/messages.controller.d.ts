import { MessagesService } from './messages.service';
import { CreateMessageDto, GetMessagesDto, GetConversationsDto } from './messages.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    sendMessage(req: any, createMessageDto: CreateMessageDto): Promise<{
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
    getUserConversations(req: any, query: GetConversationsDto): Promise<{
        conversations: unknown;
        pagination: {
            page: number;
            limit: number;
        };
    }>;
    getConversation(req: any, otherUserId: string, query: GetMessagesDto): Promise<{
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
    getUnreadMessageCount(req: any): Promise<number>;
    markMessagesAsRead(req: any, senderId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteMessage(req: any, messageId: string): Promise<{
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
}
