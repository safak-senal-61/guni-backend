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
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_roles_enum_1 = require("../common/enums/user-roles.enum");
const content_analysis_dto_1 = require("./content-analysis.dto");
let ContentAnalysisController = class ContentAnalysisController {
    contentAnalysisService;
    constructor(contentAnalysisService) {
        this.contentAnalysisService = contentAnalysisService;
    }
    async summarize(dto, req) {
        const user = req.user;
        const userId = user.id;
        return this.contentAnalysisService.summarizeContent(dto.text, userId, dto.videoUrl, dto.title);
    }
    async summarizeFile(dto, req) {
        const user = req.user;
        const userId = user.id;
        return this.contentAnalysisService.summarizeFile(dto.filePath, userId, dto.title);
    }
    async generateQuizQuestions(dto) {
        return this.contentAnalysisService.generateQuizQuestions(dto.text, dto.numberOfQuestions);
    }
    async analyzeContentWithWorkflow(dto, req) {
        const user = req.user;
        const userId = user.id;
        return this.contentAnalysisService.analyzeContentWithWorkflow(dto.text, userId, dto.analysisType);
    }
};
exports.ContentAnalysisController = ContentAnalysisController;
__decorate([
    (0, common_1.Post)('summarize'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'AI kullanarak içerik özetleme',
        description: 'Sadece ADMIN ve TEACHER rolleri AI ile içerik özetleyebilir.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'İçerik başarıyla özetlendi' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri erişebilir.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_analysis_dto_1.SummarizeContentDto, Object]),
    __metadata("design:returntype", Promise)
], ContentAnalysisController.prototype, "summarize", null);
__decorate([
    (0, common_1.Post)('summarize-file'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'AI kullanarak dosya içeriğini özetleme',
        description: 'Sadece ADMIN ve TEACHER rolleri AI ile dosya içeriğini özetleyebilir.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Dosya içeriği başarıyla özetlendi' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri erişebilir.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_analysis_dto_1.SummarizeFileDto, Object]),
    __metadata("design:returntype", Promise)
], ContentAnalysisController.prototype, "summarizeFile", null);
__decorate([
    (0, common_1.Post)('generate-quiz-questions'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'LangGraph ile gelişmiş quiz soruları oluşturma',
        description: 'Sadece ADMIN ve TEACHER rolleri LangGraph workflow kullanarak AI ile quiz soruları oluşturabilir. Gemini 2.0 Flash modeli ile güçlendirilmiştir.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Quiz soruları başarıyla oluşturuldu' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri erişebilir.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_analysis_dto_1.GenerateQuizQuestionsDto]),
    __metadata("design:returntype", Promise)
], ContentAnalysisController.prototype, "generateQuizQuestions", null);
__decorate([
    (0, common_1.Post)('analyze-workflow'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'LangGraph workflow ile gelişmiş içerik analizi',
        description: 'Sadece ADMIN ve TEACHER rolleri LangGraph workflow kullanarak kapsamlı içerik analizi yapabilir. Gemini 2.0 Flash modeli ile çoklu adımlı analiz sunar.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'İçerik analizi başarıyla tamamlandı' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri erişebilir.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [content_analysis_dto_1.AnalyzeContentWorkflowDto, Object]),
    __metadata("design:returntype", Promise)
], ContentAnalysisController.prototype, "analyzeContentWithWorkflow", null);
exports.ContentAnalysisController = ContentAnalysisController = __decorate([
    (0, swagger_1.ApiTags)('content-analysis'),
    (0, common_1.Controller)('content-analysis'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [content_analysis_service_1.ContentAnalysisService])
], ContentAnalysisController);
//# sourceMappingURL=content-analysis.controller.js.map