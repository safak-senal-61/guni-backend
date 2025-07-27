export declare class ConnectStudentDto {
    studentEmail: string;
    inviteCode?: string;
}
export declare class ApproveConnectionDto {
    connectionId: string;
    status: 'approved' | 'rejected';
}
export declare class GetProgressSummaryDto {
    studentId: string;
    startDate?: string;
    endDate?: string;
}
export declare class SendNotificationDto {
    receiverId: string;
    title: string;
    message: string;
    type: string;
    data?: any;
}
export declare class MarkNotificationReadDto {
    notificationId: string;
}
export declare class GetStudentDetailedProgressDto {
    studentId: string;
    subject?: string;
    page?: number;
    limit?: number;
}
