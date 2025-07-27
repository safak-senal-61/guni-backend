import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
      port: parseInt(this.configService.get('SMTP_PORT') || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmailVerification(email: string, token: string, firstName: string) {
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

  async sendPasswordReset(email: string, token: string, firstName: string) {
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

  async sendPasswordChangeConfirmation(email: string, firstName: string) {
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
}