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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_onboarding_service_1 = require("./user-onboarding.service");
const swagger_1 = require("@nestjs/swagger");
let DashboardController = class DashboardController {
    userOnboardingService;
    constructor(userOnboardingService) {
        this.userOnboardingService = userOnboardingService;
    }
    async getWeaknessesAnalysis(req) {
        return this.userOnboardingService.generateWeaknessAnalysis(req.user.userId);
    }
    async getProgressTracking(req, period) {
        return this.userOnboardingService.generateProgressTracking(req.user.userId, period || 'weekly');
    }
    async getStudyRecommendations(req, focus) {
        return this.userOnboardingService.generateStudyRecommendations(req.user.userId, focus || 'weaknesses');
    }
    async getAchievementSummary(req) {
        return this.userOnboardingService.generateAchievementSummary(req.user.userId);
    }
    async getPersonalizedHomepage(req, includeProgress, lessonCount) {
        return this.userOnboardingService.generatePersonalizedHomepage(req.user.userId, {
            includeProgress: includeProgress || true,
            lessonCount: lessonCount || 5
        });
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('weaknesses-analysis'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının eksiklik analizi ve iyileştirme önerileri' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Eksiklik analizi başarıyla alındı' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getWeaknessesAnalysis", null);
__decorate([
    (0, common_1.Get)('progress-tracking'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının ilerleme takibi ve istatistikleri' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'İlerleme takibi başarıyla alındı' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProgressTracking", null);
__decorate([
    (0, common_1.Get)('study-recommendations'),
    (0, swagger_1.ApiOperation)({ summary: 'Kişiselleştirilmiş çalışma önerileri' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Çalışma önerileri başarıyla oluşturuldu' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('focus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStudyRecommendations", null);
__decorate([
    (0, common_1.Get)('achievement-summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Kullanıcının başarı özeti ve motivasyon verileri' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Başarı özeti başarıyla alındı' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAchievementSummary", null);
__decorate([
    (0, common_1.Get)('personalized-homepage'),
    (0, swagger_1.ApiOperation)({ summary: 'Kişiselleştirilmiş ana sayfa içeriği' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ana sayfa içeriği başarıyla oluşturuldu' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('includeProgress')),
    __param(2, (0, common_1.Query)('lessonCount')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Boolean, Number]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPersonalizedHomepage", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [user_onboarding_service_1.UserOnboardingService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map