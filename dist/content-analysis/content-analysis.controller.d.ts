import { ContentAnalysisService } from './content-analysis.service';
import { SummarizeContentDto, SummarizeFileDto, GenerateQuizQuestionsDto, AnalyzeContentWorkflowDto } from './content-analysis.dto';
export declare class ContentAnalysisController {
    private readonly contentAnalysisService;
    constructor(contentAnalysisService: ContentAnalysisService);
    summarize(dto: SummarizeContentDto): Promise<{
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
    summarizeFile(dto: SummarizeFileDto): Promise<{
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
    analyzeContentWorkflow(dto: AnalyzeContentWorkflowDto): Promise<any>;
}
