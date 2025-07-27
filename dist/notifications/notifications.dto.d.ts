export declare class CreateNotificationDto {
    title: string;
    message: string;
    type: string;
    userId: string;
}
export declare class UpdateNotificationDto {
    isRead?: boolean;
}
export declare class GetNotificationsDto {
    page?: number;
    limit?: number;
}
