export declare class AuthDto {
    email: string;
    password: string;
}
export declare class SignupDto extends AuthDto {
    firstName: string;
    lastName: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class VerifyEmailDto {
    token: string;
}
export declare class ResendVerificationDto {
    email: string;
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
}
export declare class UserProfileDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isEmailVerified: boolean;
    dateOfBirth?: Date;
    age?: number;
    gender?: string;
    gradeLevel?: string;
    onboardingStatus: string;
    preferences?: any;
    weakSubjects: string[];
    createdAt: Date;
    updatedAt: Date;
}
