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
exports.UserOnboardingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_roles_enum_1 = require("../common/enums/user-roles.enum");
const user_onboarding_service_1 = require("./user-onboarding.service");
const user_onboarding_dto_1 = require("./user-onboarding.dto");
let UserOnboardingController = class UserOnboardingController {
    userOnboardingService;
    constructor(userOnboardingService) {
        this.userOnboardingService = userOnboardingService;
    }
    async updateProfile(req, updateData) {
        return this.userOnboardingService.updateUserProfile(req.user.sub, updateData);
    }
    async generateOnboardingQuiz(req, quizData) {
        return this.userOnboardingService.generateOnboardingQuiz(req.user.sub, quizData);
    }
    async submitOnboardingQuiz(req, quizAnswers) {
        return this.userOnboardingService.submitOnboardingQuiz(req.user.sub, quizAnswers);
    }
    async generatePersonalizedHomepage(req, options) {
        return this.userOnboardingService.generatePersonalizedHomepage(req.user.sub, options);
    }
    async getPersonalizedHomepage(req) {
        const defaultOptions = {
            lessonCount: 10,
            includeQuizzes: true,
            includeProgress: true,
        };
        return this.userOnboardingService.generatePersonalizedHomepage(req.user.sub, defaultOptions);
    }
    async getUserProfile(userId) {
        return this.userOnboardingService.getUserProfile(userId);
    }
    async refreshRecommendations(req) {
        return this.userOnboardingService.refreshRecommendations(req.user.sub);
    }
    async getWeakSubjectsAnalysis(req) {
        return this.userOnboardingService.generateWeaknessAnalysis(req.user.sub);
    }
    async getParentRequests(req) {
        return this.userOnboardingService.getParentRequests(req.user.sub);
    }
    async approveParentRequest(req, connectionId) {
        return this.userOnboardingService.approveParentRequest(req.user.sub, connectionId);
    }
    async rejectParentRequest(req, connectionId) {
        return this.userOnboardingService.rejectParentRequest(req.user.sub, connectionId);
    }
    async getConnectedParents(req) {
        return this.userOnboardingService.getConnectedParents(req.user.sub);
    }
};
exports.UserOnboardingController = UserOnboardingController;
__decorate([
    (0, common_1.Put)('profile'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update user profile for onboarding',
        description: 'Updates user profile information including age, gender, grade level, learning preferences, and weak subjects.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile updated successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid input data',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_onboarding_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)('quiz/generate'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate personalized onboarding quiz with AI',
        description: 'Generates a personalized assessment quiz using LangGraph and Gemini 2.0 Flash to identify user\'s weak subjects and learning needs.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Onboarding quiz generated successfully using AI',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid quiz parameters',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_onboarding_dto_1.OnboardingQuizDto]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "generateOnboardingQuiz", null);
__decorate([
    (0, common_1.Post)('quiz/submit'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit onboarding quiz answers for AI analysis',
        description: 'Submits quiz answers and uses LangGraph with Gemini 2.0 Flash to analyze results, identify weak subjects, and generate personalized recommendations.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Quiz answers analyzed successfully with AI-powered insights',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid quiz answers',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_onboarding_dto_1.SubmitOnboardingQuizDto]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "submitOnboardingQuiz", null);
__decorate([
    (0, common_1.Post)('homepage/personalized'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate personalized homepage with AI recommendations',
        description: 'Creates a personalized homepage using LangGraph and Gemini 2.0 Flash based on user\'s weak subjects, learning style, progress, and preferences.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Personalized homepage generated successfully with AI-powered content',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_onboarding_dto_1.PersonalizedHomepageDto]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "generatePersonalizedHomepage", null);
__decorate([
    (0, common_1.Get)('homepage/personalized'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get personalized homepage with default settings',
        description: 'Retrieves personalized homepage content using AI with default recommendation settings.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Personalized homepage retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "getPersonalizedHomepage", null);
__decorate([
    (0, common_1.Get)('profile/:userId'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user profile by ID (Admin/Teacher only)',
        description: 'Retrieves user profile information for administrative purposes.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: 'User ID to retrieve profile for',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - Insufficient permissions',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User not found',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Post)('recommendations/refresh'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.ADMIN),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh AI-powered recommendations',
        description: 'Regenerates personalized recommendations using latest user progress and AI analysis with LangGraph and Gemini 2.0 Flash.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Recommendations refreshed successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "refreshRecommendations", null);
__decorate([
    (0, common_1.Get)('analytics/weak-subjects'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get detailed weak subjects analysis',
        description: 'Provides detailed analysis of user\'s weak subjects with AI-generated improvement strategies.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Weak subjects analysis retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "getWeakSubjectsAnalysis", null);
__decorate([
    (0, common_1.Get)('parent-requests'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get pending parent connection requests',
        description: 'Retrieves all pending parent connection requests for the student.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Parent connection requests retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "getParentRequests", null);
__decorate([
    (0, common_1.Put)('parent-requests/:connectionId/approve'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Approve parent connection request',
        description: 'Approves a parent connection request, allowing the parent to monitor student progress.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'connectionId',
        description: 'Connection request ID to approve',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Parent connection request approved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Connection request not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('connectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "approveParentRequest", null);
__decorate([
    (0, common_1.Put)('parent-requests/:connectionId/reject'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Reject parent connection request',
        description: 'Rejects a parent connection request.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'connectionId',
        description: 'Connection request ID to reject',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Parent connection request rejected successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Connection request not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('connectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "rejectParentRequest", null);
__decorate([
    (0, common_1.Get)('connected-parents'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Get connected parents',
        description: 'Retrieves all approved parent connections for the student.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Connected parents retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserOnboardingController.prototype, "getConnectedParents", null);
exports.UserOnboardingController = UserOnboardingController = __decorate([
    (0, swagger_1.ApiTags)('User Onboarding & Personalization'),
    (0, common_1.Controller)('user-onboarding'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [user_onboarding_service_1.UserOnboardingService])
], UserOnboardingController);
//# sourceMappingURL=user-onboarding.controller.js.map