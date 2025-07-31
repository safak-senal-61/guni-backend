import { PrismaService } from '../prisma/prisma.service';
export declare class AiChatService {
    private prisma;
    private llm;
    constructor(prisma: PrismaService);
    processMessage(userId: string, message: string, context?: string): Promise<{
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
    getConversationHistory(userId: string, limit?: number): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        content: string;
        userId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        timestamp: Date;
    }[]>;
    generateStudySuggestions(userId: string, subject?: string, difficulty?: string): Promise<any>;
    explainTopic(userId: string, topic: string, subject: string, level?: string): Promise<any>;
    provideMotivationalSupport(userId: string, mood?: string, challenge?: string): Promise<any>;
    private cleanJsonResponse;
    private generateFallbackResponse;
    private generateFallbackStudySuggestions;
    private generateFallbackExplanation;
    private generateFallbackMotivation;
}
