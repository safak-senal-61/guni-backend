import { MessageType } from '@prisma/client';
export declare class CreateMessageDto {
    content: string;
    receiverId: string;
    type?: MessageType;
}
export declare class GetMessagesDto {
    page?: number;
    limit?: number;
}
export declare class GetConversationsDto {
    page?: number;
    limit?: number;
}
