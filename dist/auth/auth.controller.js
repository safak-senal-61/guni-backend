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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./auth.dto");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_roles_enum_1 = require("../common/enums/user-roles.enum");
const roles_guard_1 = require("../common/guards/roles.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    signin(dto) {
        return this.authService.signin(dto);
    }
    logout(req) {
        const user = req.user;
        return this.authService.logout(user.id);
    }
    refresh(dto) {
        return this.authService.refreshWithToken(dto.refreshToken);
    }
    me(req) {
        const user = req.user;
        return this.authService.getUserProfile(user.id);
    }
    verifyEmail(dto) {
        return this.authService.verifyEmail(dto);
    }
    resendVerification(dto) {
        return this.authService.resendVerification(dto);
    }
    async changePassword(req, dto) {
        const user = req.user;
        return this.authService.changePassword(user.id, dto.currentPassword, dto.newPassword);
    }
    async forgotPassword(dto) {
        return this.authService.requestPasswordReset(dto.email);
    }
    async resetPassword(dto) {
        return this.authService.resetPasswordWithToken(dto.token, dto.newPassword);
    }
    uploadProfilePicture(req, file) {
        if (!file) {
            throw new Error('No file uploaded');
        }
        const user = req.user;
        const filePath = `/uploads/${file.filename}`;
        return {
            message: 'Profil fotoğrafı başarıyla yüklendi',
            filePath: filePath,
            fileName: file.filename,
            originalName: file.originalname,
            size: file.size
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiOperation)({
        summary: 'Yeni kullanıcı oluştur',
        description: 'Yeni kullanıcı kaydı oluşturur. Varsayılan rol: STUDENT'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Hatalı istek - Geçersiz e-posta formatı veya eksik alanlar' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'E-posta zaten kullanımda' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.SignupDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('signin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Kullanıcı girişi',
        description: 'E-posta ve şifre ile kullanıcı girişi yapar. Başarılı girişte access ve refresh token döner.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı başarıyla giriş yaptı - Access ve refresh token döndürülür', type: auth_dto_1.AuthResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Hatalı istek - Eksik e-posta veya şifre' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Geçersiz kimlik bilgileri - Yanlış e-posta veya şifre' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Kullanıcı çıkışı',
        description: 'Kullanıcının refresh token\'ını geçersiz kılar ve çıkış yapar.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı başarıyla çıkış yaptı' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Erişim token\'ını yenile',
        description: 'Refresh token kullanarak yeni access token alır. Body\'de refresh token gönderilmelidir.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token başarıyla yenilendi', type: auth_dto_1.AuthResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Geçersiz refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_roles_enum_1.UserRole.STUDENT, user_roles_enum_1.UserRole.TEACHER, user_roles_enum_1.UserRole.ADMIN, user_roles_enum_1.UserRole.PARENT),
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Mevcut kullanıcıyı getir',
        description: 'Giriş yapmış kullanıcının detaylı profil bilgilerini döndürür.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kullanıcı bilgileri döndürüldü', type: auth_dto_1.UserProfileDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Verify email address' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Email verified successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired verification token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-verification'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Resend email verification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Verification email sent' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Email already verified' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResendVerificationDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resendVerification", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Şifre değiştir' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Şifre başarıyla değiştirildi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz şifre' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Yetkisiz erişim' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Şifre sıfırlama talebi' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Şifre sıfırlama e-postası gönderildi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz e-posta' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Şifre sıfırla' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Şifre başarıyla sıfırlandı' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz veya süresi dolmuş token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('upload-profile-picture'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `profile-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image files are allowed!'), false);
            }
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Profil fotoğrafı yükle',
        description: 'Kullanıcının profil fotoğrafını yükler. Desteklenen formatlar: JPG, JPEG, PNG, GIF. Maksimum boyut: 5MB'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profil fotoğrafı başarıyla yüklendi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Geçersiz dosya formatı veya boyutu' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Kimlik doğrulama gerekli' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "uploadProfilePicture", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map