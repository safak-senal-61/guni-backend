import { PrismaService } from '../prisma/prisma.service';
export declare class ContentAnalysisService {
    private readonly prisma;
    private genAI;
    private chatModel;
    constructor(prisma: PrismaService);
    summarizeContent(text: string, userId: string, videoUrl?: string, title?: string): Promise<{
        title: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        summary: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
        videoUrl: string;
        duration: number | null;
        timestamps: import("@prisma/client/runtime/library").JsonValue | null;
        notes: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
    }>;
    summarizeFile(filePath: string, userId: string, title?: string): Promise<{
        title: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        summary: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
        videoUrl: string;
        duration: number | null;
        timestamps: import("@prisma/client/runtime/library").JsonValue | null;
        notes: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
    }>;
    generateQuizQuestions(text: string, numberOfQuestions?: number): Promise<any>;
    private generateQuizWithLangGraph;
    analyzeContentWithWorkflow(text: string, userId: string, analysisType?: 'summary' | 'detailed' | 'educational'): Promise<{
        title: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        summary: import("@prisma/client/runtime/library").JsonValue;
        userId: string;
        videoUrl: string;
        duration: number | null;
        timestamps: import("@prisma/client/runtime/library").JsonValue | null;
        notes: import("@prisma/client/runtime/library").JsonValue | null;
        status: string;
    }>;
}
