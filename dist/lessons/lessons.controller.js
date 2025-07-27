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
exports.LessonsController = void 0;
const common_1 = require("@nestjs/common");
const lessons_service_1 = require("./lessons.service");
const lessons_dto_1 = require("./lessons.dto");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_roles_enum_1 = require("../common/enums/user-roles.enum");
let LessonsController = class LessonsController {
    lessonsService;
    constructor(lessonsService) {
        this.lessonsService = lessonsService;
    }
    create(createLessonDto) {
        return this.lessonsService.create(createLessonDto);
    }
    findAll() {
        return this.lessonsService.findAll();
    }
    findOne(id) {
        return this.lessonsService.findOne(id);
    }
    update(id, updateLessonDto) {
        return this.lessonsService.update(id, updateLessonDto);
    }
    remove(id) {
        return this.lessonsService.remove(id);
    }
};
exports.LessonsController = LessonsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'Yeni bir ders oluştur',
        description: 'Sadece ADMIN ve TEACHER rolleri ders oluşturabilir.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ders başarıyla oluşturuldu.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri ders oluşturabilir.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [lessons_dto_1.CreateLessonDto]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'Tüm dersleri getir',
        description: 'ADMIN, TEACHER ve STUDENT rolleri dersleri görüntüleyebilir.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tüm dersleri döndürür.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.STUDENT),
    (0, swagger_1.ApiOperation)({
        summary: 'ID ile ders getir',
        description: 'ADMIN, TEACHER ve STUDENT rolleri ders detaylarını görüntüleyebilir.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tek bir ders döndürür.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ders bulunamadı.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER),
    (0, swagger_1.ApiOperation)({
        summary: 'ID ile ders güncelle',
        description: 'Sadece ADMIN ve TEACHER rolleri ders güncelleyebilir.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ders başarıyla güncellendi.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ders bulunamadı.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri ders güncelleyebilir.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, lessons_dto_1.UpdateLessonDto]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.TEACHER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({
        summary: 'ID ile ders sil',
        description: 'Sadece ADMIN ve TEACHER rolleri ders silebilir.'
    }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Ders başarıyla silindi.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Ders bulunamadı.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri ders silebilir.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LessonsController.prototype, "remove", null);
exports.LessonsController = LessonsController = __decorate([
    (0, swagger_1.ApiTags)('lessons'),
    (0, common_1.Controller)('lessons'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [lessons_service_1.LessonsService])
], LessonsController);
//# sourceMappingURL=lessons.controller.js.map