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
exports.AiChatController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const ai_chat_service_1 = require("./ai-chat.service");
const swagger_1 = require("@nestjs/swagger");
let AiChatController = class AiChatController {
    aiChatService;
    constructor(aiChatService) {
        this.aiChatService = aiChatService;
    }
    async sendMessage(req, body) {
        return this.aiChatService.processMessage(req.user.userId, body.message, body.context);
    }
    async getConversationHistory(req, limit) {
        return this.aiChatService.getConversationHistory(req.user.userId, limit || 20);
    }
    async getStudySuggestions(req, body) {
        return this.aiChatService.generateStudySuggestions(req.user.userId, body.subject, body.difficulty);
    }
    async explainTopic(req, body) {
        return this.aiChatService.explainTopic(req.user.userId, body.topic, body.subject, body.level);
    }
    async getMotivationalSupport(req, body) {
        return this.aiChatService.provideMotivationalSupport(req.user.userId, body.mood, body.challenge);
    }
};
exports.AiChatController = AiChatController;
__decorate([
    (0, common_1.Post)('send-message'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının AI ile sohbet etmesi için mesaj gönderme' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'AI yanıtı başarıyla alındı' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversation-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının sohbet geçmişini getirme' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sohbet geçmişi başarıyla alındı' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], AiChatController.prototype, "getConversationHistory", null);
__decorate([
    (0, common_1.Post)('get-study-suggestions'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının durumuna göre çalışma önerileri alma' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Çalışma önerileri başarıyla oluşturuldu' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiChatController.prototype, "getStudySuggestions", null);
__decorate([
    (0, common_1.Post)('explain-topic'),
    (0, swagger_1.ApiOperation)({ summary: 'Belirli bir konunun AI tarafından açıklanması' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Konu açıklaması başarıyla oluşturuldu' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiChatController.prototype, "explainTopic", null);
__decorate([
    (0, common_1.Post)('motivational-support'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcıya motivasyon desteği sağlama' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Motivasyon desteği başarıyla oluşturuldu' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiChatController.prototype, "getMotivationalSupport", null);
exports.AiChatController = AiChatController = __decorate([
    (0, swagger_1.ApiTags)('AI Chat'),
    (0, common_1.Controller)('ai-chat'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ai_chat_service_1.AiChatService])
], AiChatController);
//# sourceMappingURL=ai-chat.controller.js.map