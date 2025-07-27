import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignupDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto, ResendVerificationDto } from './auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-roles.enum';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ 
    summary: 'Yeni kullanıcı oluştur',
    description: 'Yeni kullanıcı kaydı oluşturur. Varsayılan rol: STUDENT'
  })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' })
  @ApiResponse({ status: 400, description: 'Hatalı istek - Geçersiz e-posta formatı veya eksik alanlar' })
  @ApiResponse({ status: 403, description: 'E-posta zaten kullanımda' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Kullanıcı girişi',
    description: 'E-posta ve şifre ile kullanıcı girişi yapar. Başarılı girişte access ve refresh token döner.'
  })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla giriş yaptı - Access ve refresh token döndürülür' })
  @ApiResponse({ status: 400, description: 'Hatalı istek - Eksik e-posta veya şifre' })
  @ApiResponse({ status: 401, description: 'Geçersiz kimlik bilgileri - Yanlış e-posta veya şifre' })
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Kullanıcı çıkışı',
    description: 'Kullanıcının refresh token\'ını geçersiz kılar ve çıkış yapar.'
  })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla çıkış yaptı' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz' })
  @ApiBearerAuth()
  logout(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.authService.logout(user.id);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Erişim token\'ını yenile',
    description: 'Refresh token kullanarak yeni access token alır.'
  })
  @ApiResponse({ status: 200, description: 'Token başarıyla yenilendi' })
  @ApiResponse({ status: 401, description: 'Geçersiz refresh token' })
  @ApiBearerAuth()
  refresh(@Req() req: Request) {
    const user = req.user as { id: string, refreshToken: string };
    return this.authService.refresh(user.id, user.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN, UserRole.PARENT)
  @Get('me')
  @ApiOperation({ 
    summary: 'Mevcut kullanıcıyı getir',
    description: 'Giriş yapmış kullanıcının profil bilgilerini döndürür.'
  })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri döndürüldü' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz' })
  @ApiBearerAuth()
  me(@Req() req: Request) {
    return req.user;
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired verification token' })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  @ApiResponse({ status: 400, description: 'Email already verified' })
  @ApiResponse({ status: 404, description: 'User not found' })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent if user exists' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password for authenticated user' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = req.user as { id: string };
    return this.authService.changePassword(user.id, dto);
  }
}
