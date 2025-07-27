import { ContentAnalysisService } from './content-analysis.service';
import { SummarizeContentDto, SummarizeFileDto, GenerateQuizQuestionsDto, AnalyzeContentWorkflowDto } from './content-analysis.dto';
import { Request } from 'express';
export declare class ContentAnalysisController {
    private readonly contentAnalysisService;
    constructor(contentAnalysisService: ContentAnalysisService);
    summarize(dto: SummarizeContentDto, req: Request): Promise<{
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
    summarizeFile(dto: SummarizeFileDto, req: Request): Promise<{
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
    generateQuizQuestions(dto: GenerateQuizQuestionsDto): Promise<any>;
    analyzeContentWithWorkflow(dto: AnalyzeContentWorkflowDto, req: Request): Promise<{
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
