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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const library_1 = require("@prisma/client/runtime/library");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const mail_service_1 = require("../mail/mail.service");
const crypto = require("crypto");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    mailService;
    constructor(prisma, jwt, config, mailService) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.mailService = mailService;
    }
    async signup(dto) {
        const hash = await argon.hash(dto.password);
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: hash,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    emailVerificationToken,
                    emailVerificationExpires,
                },
            });
            await this.mailService.sendEmailVerification(user.email, emailVerificationToken, user.firstName);
            return {
                message: 'Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.',
                email: user.email,
            };
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Bu e-posta adresi zaten kullanılıyor');
                }
            }
            throw error;
        }
    }
    async signin(dto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user)
            throw new common_1.ForbiddenException('E-posta veya şifre hatalı');
        if (!user.isEmailVerified) {
            throw new common_1.ForbiddenException('Lütfen önce e-posta adresinizi doğrulayın');
        }
        const pwMatches = await argon.verify(user.password, dto.password);
        if (!pwMatches)
            throw new common_1.ForbiddenException('E-posta veya şifre hatalı');
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: null },
        });
    }
    async refresh(userId, refreshToken) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.hashedRefreshToken) {
            throw new common_1.UnauthorizedException('Access Denied');
        }
        const refreshTokenMatches = await argon.verify(user.hashedRefreshToken, refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.UnauthorizedException('Access Denied');
        }
        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await argon.hash(refreshToken);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRefreshToken,
            },
        });
    }
    async verifyEmail(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                emailVerificationToken: dto.token,
                emailVerificationExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Geçersiz veya süresi dolmuş doğrulama token\'ı');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpires: null,
            },
        });
        return {
            message: 'E-posta adresiniz başarıyla doğrulandı! Artık giriş yapabilirsiniz.',
        };
    }
    async resendVerification(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        if (user.isEmailVerified) {
            throw new common_1.BadRequestException('E-posta adresi zaten doğrulanmış');
        }
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerificationToken,
                emailVerificationExpires,
            },
        });
        await this.mailService.sendEmailVerification(user.email, emailVerificationToken, user.firstName);
        return {
            message: 'Doğrulama e-postası tekrar gönderildi',
        };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user) {
            return {
                message: 'Eğer bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi',
            };
        }
        const passwordResetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken,
                passwordResetExpires,
            },
        });
        await this.mailService.sendPasswordReset(user.email, passwordResetToken, user.firstName);
        return {
            message: 'Eğer bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi',
        };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetToken: dto.token,
                passwordResetExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Geçersiz veya süresi dolmuş şifre sıfırlama token\'ı');
        }
        const hashedPassword = await argon.hash(dto.newPassword);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
        await this.mailService.sendPasswordChangeConfirmation(user.email, user.firstName);
        return {
            message: 'Şifreniz başarıyla değiştirildi',
        };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Kullanıcı bulunamadı');
        }
        const currentPasswordMatches = await argon.verify(user.password, dto.currentPassword);
        if (!currentPasswordMatches) {
            throw new common_1.BadRequestException('Mevcut şifre hatalı');
        }
        const hashedNewPassword = await argon.hash(dto.newPassword);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
            },
        });
        await this.mailService.sendPasswordChangeConfirmation(user.email, user.firstName);
        return {
            message: 'Şifreniz başarıyla değiştirildi',
        };
    }
    async getTokens(userId, email) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync({ sub: userId, email }, { secret: this.config.get('JWT_SECRET'), expiresIn: '15m' }),
            this.jwt.signAsync({ sub: userId, email }, { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: '7d' }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map