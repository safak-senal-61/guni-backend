import { AuthService } from './auth.service';
import { AuthDto, SignupDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto, ResendVerificationDto, RefreshTokenDto } from './auth.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(dto: SignupDto): Promise<{
        message: string;
        email: string;
    }>;
    signin(dto: AuthDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: Request): Promise<void>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    me(req: Request): Promise<{
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
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerification(dto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    changePassword(req: Request, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    uploadProfilePicture(req: Request, file: Express.Multer.File): {
        message: string;
        filePath: string;
        fileName: string;
        originalName: string;
        size: number;
    };
}
