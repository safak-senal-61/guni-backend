import { AiChatService } from './ai-chat.service';
export declare class AiChatController {
    private readonly aiChatService;
    constructor(aiChatService: AiChatService);
    sendMessage(req: any, body: {
        message: string;
        context?: string;
    }): Promise<{
        response: any;
        timestamp: Date;
        context: {
            userLevel: import(".prisma/client").$Enums.GradeLevel | null;
            weakSubjects: string[];
            lastScore: number | undefined;
        };
        error?: undefined;
    } | {
        response: string;
        timestamp: Date;
        error: boolean;
        context?: undefined;
    }>;
    getConversationHistory(req: any, limit?: number): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        content: string;
        userId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
    }[]>;
    getStudySuggestions(req: any, body: {
        subject?: string;
        difficulty?: string;
    }): Promise<any>;
    explainTopic(req: any, body: {
        topic: string;
        subject: string;
        level?: string;
    }): Promise<any>;
    getMotivationalSupport(req: any, body: {
        mood?: string;
        challenge?: string;
    }): Promise<any>;
}
