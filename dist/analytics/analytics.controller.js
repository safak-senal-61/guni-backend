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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_roles_enum_1 = require("../common/enums/user-roles.enum");
const analytics_dto_1 = require("./analytics.dto");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getOverview() {
        try {
            const stats = await this.analyticsService.getOverallStats();
            return {
                success: true,
                data: stats,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Genel istatistikler alınırken hata oluştu',
                error: error.message,
            };
        }
    }
    async getUserEngagement(query) {
        try {
            const stats = await this.analyticsService.getUserEngagementStats(query.days);
            return {
                success: true,
                data: stats,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Kullanıcı etkileşim istatistikleri alınırken hata oluştu',
                error: error.message,
            };
        }
    }
    async getLearningProgress() {
        try {
            const progress = await this.analyticsService.getLearningProgress();
            return {
                success: true,
                data: progress,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Öğrenme ilerlemesi istatistikleri alınırken hata oluştu',
                error: error.message,
            };
        }
    }
    async getContentAnalytics() {
        try {
            const analytics = await this.analyticsService.getContentAnalytics();
            return {
                success: true,
                data: analytics,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'İçerik analitikleri alınırken hata oluştu',
                error: error.message,
            };
        }
    }
    async getActivityTimeline(query) {
        try {
            const timeline = await this.analyticsService.getUserActivityTimeline(query.days);
            return {
                success: true,
                data: timeline,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Aktivite zaman çizelgesi alınırken hata oluştu',
                error: error.message,
            };
        }
    }
    async getParentEngagement() {
        try {
            const engagement = await this.analyticsService.getParentEngagement();
            return {
                success: true,
                data: engagement,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Ebeveyn etkileşim istatistikleri alınırken hata oluştu',
                error: error.message,
            };
        }
    }
    async getAchievementStats() {
        try {
            const stats = await this.analyticsService.getAchievementStats();
            return {
                success: true,
                data: stats,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Başarı istatistikleri alınırken hata oluştu',
                error: error.message,
            };
        }
    }
    async getTopPerformers(query) {
        try {
            const topPerformers = await this.analyticsService.getLearningProgress();
            return {
                success: true,
                data: topPerformers.topPerformers,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'En başarılı öğrenciler alınırken hata oluştu',
                error: error.message,
            };
        }
    }
    async getPopularContent(query) {
        try {
            const content = await this.analyticsService.getContentAnalytics();
            return {
                success: true,
                data: {
                    popularLessons: content.popularLessons,
                    difficultQuizzes: content.difficultQuizzes,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Popüler içerik istatistikleri alınırken hata oluştu',
                error: error.message,
            };
        }
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('overview'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('engagement'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.GetAnalyticsDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserEngagement", null);
__decorate([
    (0, common_1.Get)('learning-progress'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getLearningProgress", null);
__decorate([
    (0, common_1.Get)('content'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getContentAnalytics", null);
__decorate([
    (0, common_1.Get)('timeline'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.GetTimelineDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getActivityTimeline", null);
__decorate([
    (0, common_1.Get)('parent-engagement'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getParentEngagement", null);
__decorate([
    (0, common_1.Get)('achievements'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAchievementStats", null);
__decorate([
    (0, common_1.Get)('top-performers'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.GetTopPerformersDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopPerformers", null);
__decorate([
    (0, common_1.Get)('popular-content'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analytics_dto_1.GetPopularContentDto]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getPopularContent", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map