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
exports.ParentPanelController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_roles_enum_1 = require("../common/enums/user-roles.enum");
const parent_panel_service_1 = require("./parent-panel.service");
const parent_panel_analytics_service_1 = require("./parent-panel.analytics.service");
const parent_panel_dto_1 = require("./parent-panel.dto");
const swagger_1 = require("@nestjs/swagger");
let ParentPanelController = class ParentPanelController {
    parentPanelService;
    analyticsService;
    constructor(parentPanelService, analyticsService) {
        this.parentPanelService = parentPanelService;
        this.analyticsService = analyticsService;
    }
    async getProfile(req) {
        return this.parentPanelService.getParentProfile(req.user.id);
    }
    async connectStudent(req, connectDto) {
        return this.parentPanelService.requestStudentConnection(req.user.id, connectDto);
    }
    async getPendingConnections(req) {
        return this.parentPanelService.getPendingConnections(req.user.id);
    }
    async getConnectedStudents(req) {
        return this.parentPanelService.getConnectedStudents(req.user.id);
    }
    async getStudentDetailedProgress(req, studentId, subject, page, limit) {
        const dto = {
            studentId,
            subject,
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined
        };
        return this.parentPanelService.getStudentDetailedProgress(req.user.id, dto);
    }
    async getStudentAnalytics(req, studentId) {
        return this.parentPanelService.getStudentAnalytics(req.user.id, studentId);
    }
    async sendMessageToStudent(req, body) {
        return this.parentPanelService.sendMessageToStudent(req.user.id, body.studentId, body.message, body.type);
    }
    async getDashboardSummary(req) {
        return this.parentPanelService.getDashboardSummary(req.user.id);
    }
    async getStudentSchedule(req, studentId) {
        return this.parentPanelService.getStudentSchedule(req.user.id, studentId);
    }
    async setStudyGoals(req, body) {
        return this.parentPanelService.setStudyGoals(req.user.id, body.studentId, body.goals);
    }
    async sendNotification(req, notificationDto) {
        return this.parentPanelService.sendNotificationToStudent(req.user.id, notificationDto);
    }
    async getNotifications(req, page, limit) {
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 20;
        return this.parentPanelService.getParentNotifications(req.user.id, pageNum, limitNum);
    }
    async markNotificationAsRead(req, notificationId) {
        return this.parentPanelService.markNotificationAsRead(req.user.id, notificationId);
    }
    async generateWeeklySummary(req, studentId) {
        return this.parentPanelService.generateWeeklyProgressSummary(req.user.id, studentId);
    }
    async getStudentProgressSummary(req, studentId, period = 'week') {
        return this.analyticsService.getStudentProgressSummary(req.user.id, studentId, period);
    }
    async getDashboardStats(req) {
        const connections = await this.parentPanelService.getConnectedStudents(req.user.id);
        const stats = await Promise.all(connections.map(async (conn) => {
            const summary = await this.analyticsService.getStudentProgressSummary(req.user.id, conn.id, 'week');
            return {
                studentId: conn.id,
                studentName: `${conn.firstName} ${conn.lastName}`,
                ...summary
            };
        }));
        return stats;
    }
};
exports.ParentPanelController = ParentPanelController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get parent profile',
        description: 'Retrieves the parent profile information including connected students.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Parent profile retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('connect-student'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Request student connection',
        description: 'Sends a connection request to a student for monitoring their progress.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Connection request sent successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid student email or connection already exists' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, parent_panel_dto_1.ConnectStudentDto]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "connectStudent", null);
__decorate([
    (0, common_1.Get)('pending-connections'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get pending connections',
        description: 'Retrieves all pending student connection requests.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending connections retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getPendingConnections", null);
__decorate([
    (0, common_1.Get)('connected-students'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get connected students',
        description: 'Retrieves all approved student connections.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connected students retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized - Invalid or missing authentication token' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getConnectedStudents", null);
__decorate([
    (0, common_1.Get)('student-progress/:studentId'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Query)('subject')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getStudentDetailedProgress", null);
__decorate([
    (0, common_1.Get)('student-analytics/:studentId'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getStudentAnalytics", null);
__decorate([
    (0, common_1.Post)('send-message'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "sendMessageToStudent", null);
__decorate([
    (0, common_1.Get)('dashboard-summary'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getDashboardSummary", null);
__decorate([
    (0, common_1.Get)('student-schedule/:studentId'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getStudentSchedule", null);
__decorate([
    (0, common_1.Post)('set-study-goals'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "setStudyGoals", null);
__decorate([
    (0, common_1.Post)('send-notification'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, parent_panel_dto_1.SendNotificationDto]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Put)('notifications/:notificationId/read'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('notificationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "markNotificationAsRead", null);
__decorate([
    (0, common_1.Post)('weekly-summary/:studentId'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "generateWeeklySummary", null);
__decorate([
    (0, common_1.Get)('student-summary/:studentId'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getStudentProgressSummary", null);
__decorate([
    (0, common_1.Get)('dashboard-stats'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ParentPanelController.prototype, "getDashboardStats", null);
exports.ParentPanelController = ParentPanelController = __decorate([
    (0, swagger_1.ApiTags)('parent-panel'),
    (0, common_1.Controller)('parent-panel'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.PARENT),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [parent_panel_service_1.ParentPanelService,
        parent_panel_analytics_service_1.ParentPanelAnalyticsService])
], ParentPanelController);
//# sourceMappingURL=parent-panel.controller.js.map