import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Get, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignupDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto, ResendVerificationDto, RefreshTokenDto, AuthResponseDto, UserProfileDto } from './auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-roles.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla giriş yaptı - Access ve refresh token döndürülür', type: AuthResponseDto })
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

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Erişim token\'ını yenile',
    description: 'Refresh token kullanarak yeni access token alır. Body\'de refresh token gönderilmelidir.'
  })
  @ApiResponse({ status: 200, description: 'Token başarıyla yenilendi', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Geçersiz refresh token' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshWithToken(dto.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN, UserRole.PARENT)
  @Get('me')
  @ApiOperation({ 
    summary: 'Mevcut kullanıcıyı getir',
    description: 'Giriş yapmış kullanıcının detaylı profil bilgilerini döndürür.'
  })
  @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri döndürüldü', type: UserProfileDto })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz' })
  @ApiBearerAuth()
  me(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.authService.getUserProfile(user.id);
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



  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Şifre değiştir' })
  @ApiResponse({ status: 200, description: 'Şifre başarıyla değiştirildi' })
  @ApiResponse({ status: 400, description: 'Geçersiz şifre' })
  @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const user = req.user as { id: string };
    return this.authService.changePassword(user.id, dto.currentPassword, dto.newPassword);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Şifre sıfırlama talebi' })
  @ApiResponse({ status: 200, description: 'Şifre sıfırlama e-postası gönderildi' })
  @ApiResponse({ status: 400, description: 'Geçersiz e-posta' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Şifre sıfırla' })
  @ApiResponse({ status: 200, description: 'Şifre başarıyla sıfırlandı' })
  @ApiResponse({ status: 400, description: 'Geçersiz veya süresi dolmuş token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPasswordWithToken(dto.token, dto.newPassword);
  }

  @Post('upload-profile-picture')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ 
    summary: 'Profil fotoğrafı yükle',
    description: 'Kullanıcının profil fotoğrafını yükler. Desteklenen formatlar: JPG, JPEG, PNG, GIF. Maksimum boyut: 5MB'
  })
  @ApiResponse({ status: 200, description: 'Profil fotoğrafı başarıyla yüklendi' })
  @ApiResponse({ status: 400, description: 'Geçersiz dosya formatı veya boyutu' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli' })
  uploadProfilePicture(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    const user = req.user as { id: string };
    const filePath = `/uploads/${file.filename}`;
    
    return {
      message: 'Profil fotoğrafı başarıyla yüklendi',
      filePath: filePath,
      fileName: file.filename,
      originalName: file.originalname,
      size: file.size
    };
  }
}
