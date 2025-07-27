"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const content_analysis_module_1 = require("./content-analysis/content-analysis.module");
const lessons_module_1 = require("./lessons/lessons.module");
const quizzes_module_1 = require("./quizzes/quizzes.module");
const uploads_module_1 = require("./uploads/uploads.module");
const student_panel_module_1 = require("./student-panel/student-panel.module");
const parent_panel_module_1 = require("./parent-panel/parent-panel.module");
const user_onboarding_module_1 = require("./user-onboarding/user-onboarding.module");
const notifications_module_1 = require("./notifications/notifications.module");
const achievements_module_1 = require("./achievements/achievements.module");
const messages_module_1 = require("./messages/messages.module");
const analytics_module_1 = require("./analytics/analytics.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            content_analysis_module_1.ContentAnalysisModule,
            lessons_module_1.LessonsModule,
            quizzes_module_1.QuizzesModule,
            uploads_module_1.UploadsModule,
            student_panel_module_1.StudentPanelModule,
            parent_panel_module_1.ParentPanelModule,
            user_onboarding_module_1.UserOnboardingModule,
            notifications_module_1.NotificationsModule,
            achievements_module_1.AchievementsModule,
            messages_module_1.MessagesModule,
            analytics_module_1.AnalyticsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map