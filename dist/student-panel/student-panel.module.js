"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentPanelModule = void 0;
const common_1 = require("@nestjs/common");
const student_panel_controller_1 = require("./student-panel.controller");
const student_panel_service_1 = require("./student-panel.service");
const prisma_module_1 = require("../prisma/prisma.module");
const achievements_module_1 = require("../achievements/achievements.module");
const notifications_module_1 = require("../notifications/notifications.module");
let StudentPanelModule = class StudentPanelModule {
};
exports.StudentPanelModule = StudentPanelModule;
exports.StudentPanelModule = StudentPanelModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, achievements_module_1.AchievementsModule, notifications_module_1.NotificationsModule],
        controllers: [student_panel_controller_1.StudentPanelController],
        providers: [student_panel_service_1.StudentPanelService],
        exports: [student_panel_service_1.StudentPanelService],
    })
], StudentPanelModule);
//# sourceMappingURL=student-panel.module.js.map