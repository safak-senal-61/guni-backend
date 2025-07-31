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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentAnalysisController = void 0;
const common_1 = require("@nestjs/common");
const content_analysis_service_1 = require("./content-analysis.service");
const swagger_1 = require("@nestjs/swagger");
const content_analysis_dto_1 = require("./content-analysis.dto");
let ContentAnalysisController = class ContentAnalysisController {
    contentAnalysisService;
    constructor(contentAnalysisService) {
        this.contentAnalysisService = contentAnalysisService;
    }
    async summarize(dto) {
        const userId = 'public-user';
        return this.contentAnalysisService.summarizeContent(dto.text, userId, dto.videoUrl, dto.title, dto.subject, dto.gradeLevel, dto.learningObjectives, dto.targetAudience, dto.difficultyLevel, dto.durationMinutes, dto.keyTopics, dto.summaryType);
    }
    async summarizeFile(dto) {
        const userId = 'public-user';
        return this.contentAnalysisService.summarizeFileEnhanced(dto.filePath, userId, dto.title, dto.subject, dto.gradeLevel, dto.learningObjectives, dto.targetAudience, dto.difficultyLevel, dto.durationMinutes, dto.keyTopics, dto.summaryType);
    }
    async generateQuizQuestions(dto) {
        const userId = 'public-user';
        return this.contentAnalysisService.generateQuizQuestionsEnhanced(dto.text, dto.numberOfQuestions || 5, userId, dto.subject, dto.gradeLevel, dto.difficultyLevel, dto.questionType, dto.learningObjectives, dto.keyTopics, dto.language);
    }
    async analyzeContentWorkflow(dto) {
        const userId = 'public-user';
        return this.contentAnalysisService.analyzeContentWorkflowEnhanced(dto.text, userId, dto.analysisType?.toString(), dto.subject, dto.gradeLevel, dto.learningObjectives, dto.targetAudience, dto.difficultyLevel, dto.keyTopics, dto.analysisDepth, dto.includeRecommendations, dto.language);
    }
};
exports.ContentAnalysisController = ContentAnalysisController;
__decorate([
    (0, common_1.Post)('summarize'),
    (0, swagger_1.ApiOperation)({
        summary: 'AI kullanarak gelişmiş içerik özetleme',
        description: 'Herkes tarafından erişilebilir. LangChain ve Gemini 2.0 Flash ile güçlendirilmiş detaylı eğitimsel özetleme.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'İçerik başarıyla özetlendi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz istek verisi' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Sunucu hatası' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_analysis_dto_1.SummarizeContentDto]),
    __metadata("design:returntype", Promise)
], ContentAnalysisController.prototype, "summarize", null);
__decorate([
    (0, common_1.Post)('summarize-file'),
    (0, swagger_1.ApiOperation)({
        summary: 'AI kullanarak gelişmiş dosya içeriği özetleme',
        description: 'Herkes tarafından erişilebilir. LangChain ve Gemini 2.0 Flash ile güçlendirilmiş dosya özetleme.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Dosya içeriği başarıyla özetlendi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz istek verisi' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Sunucu hatası' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_analysis_dto_1.SummarizeFileDto]),
    __metadata("design:returntype", Promise)
], ContentAnalysisController.prototype, "summarizeFile", null);
__decorate([
    (0, common_1.Post)('generate-quiz-questions'),
    (0, swagger_1.ApiOperation)({
        summary: 'LangChain ile gelişmiş quiz soruları oluşturma',
        description: 'Herkes tarafından erişilebilir. LangChain ve Gemini 2.0 Flash ile güçlendirilmiş quiz sorusu üretimi.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Quiz soruları başarıyla oluşturuldu' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz istek verisi' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Sunucu hatası' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_analysis_dto_1.GenerateQuizQuestionsDto]),
    __metadata("design:returntype", Promise)
], ContentAnalysisController.prototype, "generateQuizQuestions", null);
__decorate([
    (0, common_1.Post)('analyze-workflow'),
    (0, swagger_1.ApiOperation)({
        summary: 'LangGraph workflow ile gelişmiş içerik analizi',
        description: 'Herkes tarafından erişilebilir. LangGraph workflow ve Gemini 2.0 Flash ile güçlendirilmiş içerik analizi.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'İçerik analizi başarıyla tamamlandı' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz istek verisi' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Sunucu hatası' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_analysis_dto_1.AnalyzeContentWorkflowDto]),
    __metadata("design:returntype", Promise)
], ContentAnalysisController.prototype, "analyzeContentWorkflow", null);
exports.ContentAnalysisController = ContentAnalysisController = __decorate([
    (0, swagger_1.ApiTags)('content-analysis'),
    (0, common_1.Controller)('content-analysis'),
    __metadata("design:paramtypes", [content_analysis_service_1.ContentAnalysisService])
], ContentAnalysisController);
//# sourceMappingURL=content-analysis.controller.js.map