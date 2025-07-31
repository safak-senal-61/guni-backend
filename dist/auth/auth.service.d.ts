import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { AuthDto, SignupDto, ForgotPasswordDto, ResetPasswordDto, VerifyEmailDto, ResendVerificationDto } from './auth.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    private mailService;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, mailService: MailService);
    signup(dto: SignupDto): Promise<{
        message: string;
        email: string;
    }>;
    signin(dto: AuthDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string): Promise<void>;
    refresh(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshWithToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(dto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPasswordWithToken(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    getUserProfile(userId: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        isEmailVerified: boolean;
        dateOfBirth: Date | null;
        age: number | null;
        gender: import(".prisma/client").$Enums.Gender | null;
        gradeLevel: import(".prisma/client").$Enums.GradeLevel | null;
        onboardingStatus: import(".prisma/client").$Enums.OnboardingStatus;
        preferences: import("@prisma/client/runtime/library").JsonValue;
        weakSubjects: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    getTokens(userId: string, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
