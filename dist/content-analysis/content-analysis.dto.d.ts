export declare class SummarizeContentDto {
    text: string;
    videoUrl?: string;
    title?: string;
}
export declare class SummarizeFileDto {
    filePath: string;
    title?: string;
}
export declare class GenerateQuizQuestionsDto {
    text: string;
    numberOfQuestions?: number;
}
export declare enum AnalysisType {
    SUMMARY = "summary",
    DETAILED = "detailed",
    EDUCATIONAL = "educational"
}
export declare class AnalyzeContentWorkflowDto {
    text: string;
    analysisType?: AnalysisType;
}
