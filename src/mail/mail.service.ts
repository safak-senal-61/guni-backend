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

  async sendPasswordResetEmail(email: string, resetToken: string, firstName: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: this.configService.get('SMTP_FROM') || this.configService.get('SMTP_USER'),
      to: email,
      subject: 'Şifre Sıfırlama - Günü Birlik Doz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1976d2; margin: 0; font-size: 28px;">🔐 Şifre Sıfırlama</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">Günü Birlik Doz</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${firstName}!</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Hesabınız için şifre sıfırlama talebinde bulundunuz. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);">
                🔑 Şifremi Sıfırla
              </a>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Önemli Bilgi</p>
              <p style="margin: 5px 0 0 0; color: #856404;">Bu bağlantı 24 saat boyunca geçerlidir. Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2e7d32; margin-top: 0;">📞 Destek ve İletişim</h3>
              <p style="color: #2e7d32; margin: 0;">Herhangi bir sorunuz olduğunda bizimle iletişime geçmekten çekinmeyin:</p>
              <p style="color: #2e7d32; margin: 10px 0 0 0;">📧 <strong>info@gunibirlikdoz.com</strong></p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Bu e-posta Günü Birlik Doz tarafından gönderilmiştir.<br>
                © 2024 Günü Birlik Doz - Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    const loginUrl = `${this.configService.get('FRONTEND_URL')}/login`;
    
    const mailOptions = {
      from: this.configService.get('SMTP_FROM') || this.configService.get('SMTP_USER'),
      to: email,
      subject: '🎓 Günü Birlik Doz\'a Hoş Geldiniz!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1976d2; margin: 0; font-size: 28px;">🎓 Günü Birlik Doz</h1>
              <p style="color: #666; margin: 10px 0 0 0; font-size: 16px;">AI Destekli Eğitim Platformu</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Merhaba ${firstName}! 👋</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              <strong>Günü Birlik Doz</strong> ailesine katıldığınız için çok mutluyuz! Yapay zeka destekli eğitim platformumuzda sizi bekleyen harika özellikler:
            </p>
            
            <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976d2; margin-top: 0;">🌟 Platform Özellikleri</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li>🤖 <strong>AI Destekli Kişiselleştirilmiş Öğrenme:</strong> Size özel ders planları</li>
                <li>📊 <strong>Akıllı Analiz:</strong> Güçlü ve zayıf yönlerinizi keşfedin</li>
                <li>🎯 <strong>Hedef Odaklı Çalışma:</strong> Eksikliklerinize odaklanan öneriler</li>
                <li>💬 <strong>AI Asistan:</strong> 7/24 öğrenme desteği</li>
                <li>🏆 <strong>Başarı Takibi:</strong> İlerlemenizi görsel olarak takip edin</li>
                <li>📚 <strong>Zengin İçerik:</strong> Tüm dersler için kapsamlı materyaller</li>
              </ul>
            </div>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404; font-weight: bold;">⚠️ Önemli Hatırlatma</p>
              <p style="margin: 5px 0 0 0; color: #856404;">Hesabınızı kullanmaya başlamadan önce e-posta adresinizi doğrulamanız gerekmektedir.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" 
                 style="background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; padding: 15px 40px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);">
                🚀 Öğrenmeye Başla
              </a>
            </div>
            
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2e7d32; margin-top: 0;">📞 Destek ve İletişim</h3>
              <p style="color: #2e7d32; margin: 0;">Herhangi bir sorunuz olduğunda bizimle iletişime geçmekten çekinmeyin:</p>
              <p style="color: #2e7d32; margin: 10px 0 0 0;">📧 <strong>info@gunibirlikdoz.com</strong></p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Bu e-posta Günü Birlik Doz tarafından gönderilmiştir.<br>
                © 2024 Günü Birlik Doz - Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}