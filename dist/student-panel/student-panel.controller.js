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
exports.StudentPanelController = void 0;
const common_1 = require("@nestjs/common");
const student_panel_service_1 = require("./student-panel.service");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
const user_roles_enum_1 = require("../common/enums/user-roles.enum");
let StudentPanelController = class StudentPanelController {
    studentPanelService;
    constructor(studentPanelService) {
        this.studentPanelService = studentPanelService;
    }
    async getDashboard(req) {
        return this.studentPanelService.getStudentDashboard(req.user.userId);
    }
    async getProgress(req) {
        return this.studentPanelService.getStudentProgress(req.user.userId);
    }
    async getStats(req) {
        return this.studentPanelService.getStudentStats(req.user.userId);
    }
    async getUpcomingLessons(req, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.studentPanelService.getUpcomingLessons(req.user.userId, limitNum);
    }
    async getRecommendedQuizzes(req, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 3;
        return this.studentPanelService.getRecommendedQuizzes(req.user.userId, limitNum);
    }
    async getRecentQuizResults(req, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.studentPanelService.getRecentQuizResults(req.user.userId, limitNum);
    }
};
exports.StudentPanelController = StudentPanelController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentPanelController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('progress'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentPanelController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudentPanelController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('upcoming-lessons'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StudentPanelController.prototype, "getUpcomingLessons", null);
__decorate([
    (0, common_1.Get)('recommended-quizzes'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StudentPanelController.prototype, "getRecommendedQuizzes", null);
__decorate([
    (0, common_1.Get)('recent-quiz-results'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StudentPanelController.prototype, "getRecentQuizResults", null);
exports.StudentPanelController = StudentPanelController = __decorate([
    (0, common_1.Controller)('student-panel'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT),
    __metadata("design:paramtypes", [student_panel_service_1.StudentPanelService])
], StudentPanelController);
//# sourceMappingURL=student-panel.controller.js.map