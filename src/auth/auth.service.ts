import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import * as crypto from 'crypto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import {
  AuthDto,
  SignupDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  ResendVerificationDto
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  async signup(dto: SignupDto) {
    // Generate the password hash
    const hash = await argon.hash(dto.password);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save the new user in the db
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

      // Send verification and welcome emails
      try {
        await Promise.all([
          this.mailService.sendEmailVerification(
            user.email,
            emailVerificationToken,
            user.firstName,
          ),
          this.mailService.sendWelcomeEmail(
            user.email,
            user.firstName
          )
        ]);
      } catch (emailError) {
        console.warn('Email sending failed:', emailError.message);
        // Continue with signup even if email fails
      }

      return {
        message: 'Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.',
        email: user.email,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Bu e-posta adresi zaten kullanılıyor');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // If user does not exist throw exception
    if (!user) throw new ForbiddenException('E-posta veya şifre hatalı');

    // Compare password
    const pwMatches = await argon.verify(user.password, dto.password);
    // If password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('E-posta veya şifre hatalı');

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Hesabınızı kullanmadan önce e-posta adresinizi doğrulamanız gerekmektedir. Lütfen e-postanızı kontrol edin.');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    const refreshTokenMatches = await argon.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async refreshWithToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const userId = payload.sub;
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      
      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Geçersiz refresh token');
      }

      // Verify the refresh token matches the stored hash
      const refreshTokenMatches = await argon.verify(
        user.hashedRefreshToken,
        refreshToken,
      );
      
      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Geçersiz refresh token');
      }

      // Generate new tokens
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Geçersiz refresh token');
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
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

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: dto.token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş doğrulama token\'ı');
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

  async resendVerification(dto: ResendVerificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('E-posta adresi zaten doğrulanmış');
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

    await this.mailService.sendEmailVerification(
      user.email,
      emailVerificationToken,
      user.firstName,
    );

    return {
      message: 'Doğrulama e-postası tekrar gönderildi',
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        message: 'Eğer bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi',
      };
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    await this.mailService.sendPasswordReset(
      user.email,
      passwordResetToken,
      user.firstName,
    );

    return {
      message: 'Eğer bu e-posta adresi sistemde kayıtlıysa, şifre sıfırlama bağlantısı gönderildi',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş şifre sıfırlama token\'ı');
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

    await this.mailService.sendPasswordChangeConfirmation(
      user.email,
      user.firstName,
    );

    return {
      message: 'Şifreniz başarıyla değiştirildi',
    };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const isOldPasswordValid = await argon.verify(user.password, oldPassword);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Mevcut şifre yanlış');
    }

    const hashedNewPassword = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Şifre değişikliği e-postası gönder
    try {
      await this.mailService.sendPasswordChangeConfirmation(
        user.email,
        user.firstName,
      );
    } catch (emailError) {
      console.warn('Email sending failed:', emailError.message);
    }

    return { message: 'Şifre başarıyla değiştirildi' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Güvenlik nedeniyle kullanıcı bulunamasa bile başarılı mesaj döndür
      return { message: 'Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.' };
    }

    // Şifre sıfırlama token'ı oluştur (24 saat geçerli)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpiry,
      },
    });

    // Şifre sıfırlama e-postası gönder
    try {
      await this.mailService.sendPasswordResetEmail(
        user.email,
        resetToken,
        user.firstName,
      );
    } catch (emailError) {
      console.warn('Email sending failed:', emailError.message);
    }

    return { message: 'Eğer bu e-posta adresine kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi.' };
  }

  async resetPasswordWithToken(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Geçersiz veya süresi dolmuş şifre sıfırlama token\'ı');
    }

    const hashedPassword = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Şifre değişikliği onay e-postası gönder
    try {
      await this.mailService.sendPasswordChangeConfirmation(
        user.email,
        user.firstName,
      );
    } catch (emailError) {
      console.warn('Email sending failed:', emailError.message);
    }

    return { message: 'Şifre başarıyla sıfırlandı' };
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        dateOfBirth: true,
        age: true,
        gender: true,
        gradeLevel: true,
        onboardingStatus: true,
        preferences: true,
        weakSubjects: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return user;
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email },
        { 
          secret: this.config.get('JWT_SECRET'), 
          expiresIn: this.config.get('JWT_EXPIRES_IN') || '15m' 
        },
      ),
      this.jwt.signAsync(
        { sub: userId, email },
        { 
          secret: this.config.get('JWT_REFRESH_SECRET'), 
          expiresIn: this.config.get('REFRESH_TOKEN_EXPIRES_IN') || '7d' 
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
