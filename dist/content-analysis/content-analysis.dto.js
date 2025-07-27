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
class SummarizeFileDto {
    filePath;
    title;
}
exports.SummarizeFileDto = SummarizeFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Path to the file to summarize' }),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "filePath", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the content (optional)', required: false }),
    __metadata("design:type", String)
], SummarizeFileDto.prototype, "title", void 0);
class GenerateQuizQuestionsDto {
    text;
    numberOfQuestions;
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
var AnalysisType;
(function (AnalysisType) {
    AnalysisType["SUMMARY"] = "summary";
    AnalysisType["DETAILED"] = "detailed";
    AnalysisType["EDUCATIONAL"] = "educational";
})(AnalysisType || (exports.AnalysisType = AnalysisType = {}));
class AnalyzeContentWorkflowDto {
    text;
    analysisType;
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
//# sourceMappingURL=content-analysis.dto.js.map