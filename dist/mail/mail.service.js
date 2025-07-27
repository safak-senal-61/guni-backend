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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let MailService = class MailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
            port: parseInt(this.configService.get('SMTP_PORT') || '587'),
            secure: false,
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }
    async sendEmailVerification(email, token, firstName) {
        const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
        const mailOptions = {
            from: this.configService.get('SMTP_FROM') || this.configService.get('SMTP_USER'),
            to: email,
            subject: 'E-posta Adresinizi Doğrulayın - Günü Birlik Doz',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Merhaba ${firstName}!</h2>
          <p>Günü Birlik Doz platformuna hoş geldiniz! E-posta adresinizi doğrulamak için aşağıdaki butona tıklayın:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              E-posta Adresimi Doğrula
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Bu link 24 saat geçerlidir. Eğer bu e-postayı siz talep etmediyseniz, lütfen görmezden gelin.
          </p>
          <p style="color: #666; font-size: 14px;">
            Link çalışmıyorsa, aşağıdaki URL'yi tarayıcınıza kopyalayın:<br>
            ${verificationUrl}
          </p>
        </div>
      `,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendPasswordReset(email, token, firstName) {
        const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
        const mailOptions = {
            from: this.configService.get('SMTP_FROM') || this.configService.get('SMTP_USER'),
            to: email,
            subject: 'Şifre Sıfırlama - Günü Birlik Doz',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Merhaba ${firstName}!</h2>
          <p>Şifrenizi sıfırlamak için bir talepte bulundunuz. Yeni şifre oluşturmak için aşağıdaki butona tıklayın:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Şifremi Sıfırla
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Bu link 1 saat geçerlidir. Eğer bu talebi siz yapmadıysanız, lütfen görmezden gelin.
          </p>
          <p style="color: #666; font-size: 14px;">
            Link çalışmıyorsa, aşağıdaki URL'yi tarayıcınıza kopyalayın:<br>
            ${resetUrl}
          </p>
        </div>
      `,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendPasswordChangeConfirmation(email, firstName) {
        const mailOptions = {
            from: this.configService.get('SMTP_FROM') || this.configService.get('SMTP_USER'),
            to: email,
            subject: 'Şifreniz Değiştirildi - Günü Birlik Doz',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Merhaba ${firstName}!</h2>
          <p>Hesabınızın şifresi başarıyla değiştirildi.</p>
          <p style="color: #666; font-size: 14px;">
            Eğer bu değişikliği siz yapmadıysanız, lütfen derhal bizimle iletişime geçin.
          </p>
          <p style="color: #666; font-size: 14px;">
            Güvenliğiniz için düzenli olarak şifrenizi değiştirmenizi öneririz.
          </p>
        </div>
      `,
        };
        await this.transporter.sendMail(mailOptions);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map