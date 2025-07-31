export declare class SummarizeContentDto {
    text: string;
    videoUrl?: string;
    title?: string;
    subject?: string;
    gradeLevel?: string;
    learningObjectives?: string;
    targetAudience?: string;
    difficultyLevel?: string;
    durationMinutes?: number;
    keyTopics?: string;
    summaryType?: string;
}
export declare class SummarizeFileDto {
    filePath: string;
    title?: string;
    subject?: string;
    gradeLevel?: string;
    learningObjectives?: string;
    targetAudience?: string;
    difficultyLevel?: string;
    durationMinutes?: number;
    keyTopics?: string;
    summaryType?: string;
}
export declare class GenerateQuizQuestionsDto {
    text: string;
    numberOfQuestions?: number;
    subject?: string;
    gradeLevel?: string;
    difficultyLevel?: string;
    questionType?: string;
    learningObjectives?: string;
    keyTopics?: string;
    language?: string;
}
export declare enum AnalysisType {
    SUMMARY = "summary",
    DETAILED = "detailed",
    EDUCATIONAL = "educational"
}
export declare class AnalyzeContentWorkflowDto {
    text: string;
    analysisType?: AnalysisType;
    subject?: string;
    gradeLevel?: string;
    learningObjectives?: string;
    targetAudience?: string;
    difficultyLevel?: string;
    keyTopics?: string;
    analysisDepth?: string;
    includeRecommendations?: boolean;
    language?: string;
}
