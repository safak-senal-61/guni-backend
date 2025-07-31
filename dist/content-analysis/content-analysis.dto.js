"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzeContentWorkflowDto = exports.AnalysisType = exports.GenerateQuizQuestionsDto = exports.SummarizeFileDto = exports.SummarizeContentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SummarizeContentDto {
    text;
    videoUrl;
    title;
    subject;
    gradeLevel;
    learningObjectives;
    targetAudience;
    difficultyLevel;
    durationMinutes;
    keyTopics;
    summaryType;
}
exports.SummarizeContentDto = SummarizeContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Text content to summarize', required: true }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL of the video (optional)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "videoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the content (optional)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subject area (e.g., Mathematics, Science, History)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grade level (e.g., 5th Grade, 8th Grade, High School)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Learning objectives or goals', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "learningObjectives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target audience (e.g., students, teachers, parents)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "targetAudience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Difficulty level (beginner, intermediate, advanced)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "difficultyLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration of the content in minutes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SummarizeContentDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Key topics or keywords to focus on', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "keyTopics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of summary needed (brief, detailed, educational)', required: false, default: 'educational' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeContentDto.prototype, "summaryType", void 0);
class SummarizeFileDto {
    filePath;
    title;
    subject;
    gradeLevel;
    learningObjectives;
    targetAudience;
    difficultyLevel;
    durationMinutes;
    keyTopics;
    summaryType;
}
exports.SummarizeFileDto = SummarizeFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Path to the file to summarize' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the content (optional)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subject area (e.g., Mathematics, Science, History)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grade level (e.g., 5th Grade, 8th Grade, High School)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Learning objectives or goals', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "learningObjectives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target audience (e.g., students, teachers, parents)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "targetAudience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Difficulty level (beginner, intermediate, advanced)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "difficultyLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Duration of the content in minutes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SummarizeFileDto.prototype, "durationMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Key topics or keywords to focus on', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "keyTopics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Type of summary needed (brief, detailed, educational)', required: false, default: 'educational' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "summaryType", void 0);
class GenerateQuizQuestionsDto {
    text;
    numberOfQuestions;
    subject;
    gradeLevel;
    difficultyLevel;
    questionType;
    learningObjectives;
    keyTopics;
    language;
}
exports.GenerateQuizQuestionsDto = GenerateQuizQuestionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Text content to generate questions from' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateQuizQuestionsDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of questions to generate', required: false, default: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GenerateQuizQuestionsDto.prototype, "numberOfQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subject area (e.g., Mathematics, Science, History)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizQuestionsDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grade level (e.g., 5th Grade, 8th Grade, High School)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizQuestionsDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Difficulty level (easy, medium, hard)', required: false, default: 'medium' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizQuestionsDto.prototype, "difficultyLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Question type (multiple-choice, true-false, fill-blank)', required: false, default: 'multiple-choice' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizQuestionsDto.prototype, "questionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Learning objectives to focus on', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizQuestionsDto.prototype, "learningObjectives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Key topics or keywords to emphasize', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizQuestionsDto.prototype, "keyTopics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Language for questions (Turkish, English)', required: false, default: 'Turkish' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateQuizQuestionsDto.prototype, "language", void 0);
var AnalysisType;
(function (AnalysisType) {
    AnalysisType["SUMMARY"] = "summary";
    AnalysisType["DETAILED"] = "detailed";
    AnalysisType["EDUCATIONAL"] = "educational";
})(AnalysisType || (exports.AnalysisType = AnalysisType = {}));
class AnalyzeContentWorkflowDto {
    text;
    analysisType;
    subject;
    gradeLevel;
    learningObjectives;
    targetAudience;
    difficultyLevel;
    keyTopics;
    analysisDepth;
    includeRecommendations;
    language;
}
exports.AnalyzeContentWorkflowDto = AnalyzeContentWorkflowDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Text content to analyze with LangGraph workflow' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Type of analysis to perform',
        enum: AnalysisType,
        required: false,
        default: AnalysisType.SUMMARY
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(AnalysisType),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "analysisType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subject area (e.g., Mathematics, Science, History)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Grade level (e.g., 5th Grade, 8th Grade, High School)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Learning objectives or goals', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "learningObjectives", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target audience (e.g., students, teachers, parents)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "targetAudience", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Difficulty level (beginner, intermediate, advanced)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "difficultyLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Key topics or keywords to focus on', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "keyTopics", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Analysis depth (shallow, moderate, deep)', required: false, default: 'moderate' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "analysisDepth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Include educational recommendations', required: false, default: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], AnalyzeContentWorkflowDto.prototype, "includeRecommendations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Language for analysis output (Turkish, English)', required: false, default: 'Turkish' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnalyzeContentWorkflowDto.prototype, "language", void 0);
//# sourceMappingURL=content-analysis.dto.js.map