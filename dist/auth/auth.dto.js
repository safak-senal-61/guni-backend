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
exports.UserProfileDto = exports.AuthResponseDto = exports.RefreshTokenDto = exports.ResendVerificationDto = exports.VerifyEmailDto = exports.ChangePasswordDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.SignupDto = exports.AuthDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AuthDto {
    email;
    password;
}
exports.AuthDto = AuthDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test@example.com', description: 'User email' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], AuthDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123', description: 'User password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], AuthDto.prototype, "password", void 0);
class SignupDto extends AuthDto {
    firstName;
    lastName;
}
exports.SignupDto = SignupDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John', description: 'User first name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignupDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe', description: 'User last name' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignupDto.prototype, "lastName", void 0);
class ForgotPasswordDto {
    email;
}
exports.ForgotPasswordDto = ForgotPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test@example.com', description: 'User email' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
class ResetPasswordDto {
    token;
    newPassword;
}
exports.ResetPasswordDto = ResetPasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'abc123def456', description: 'Password reset token' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'newpassword123', description: 'New password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "newPassword", void 0);
class ChangePasswordDto {
    currentPassword;
    newPassword;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'oldpassword123', description: 'Current password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "currentPassword", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'newpassword123', description: 'New password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "newPassword", void 0);
class VerifyEmailDto {
    token;
}
exports.VerifyEmailDto = VerifyEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'abc123def456', description: 'Email verification token' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "token", void 0);
class ResendVerificationDto {
    email;
}
exports.ResendVerificationDto = ResendVerificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test@example.com', description: 'User email' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ResendVerificationDto.prototype, "email", void 0);
class RefreshTokenDto {
    refreshToken;
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Refresh token to get new access token'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);
class AuthResponseDto {
    accessToken;
    refreshToken;
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT access token (expires in 15 minutes)'
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT refresh token (expires in 7 days)'
    }),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refreshToken", void 0);
class UserProfileDto {
    id;
    email;
    firstName;
    lastName;
    role;
    isEmailVerified;
    dateOfBirth;
    age;
    gender;
    gradeLevel;
    onboardingStatus;
    preferences;
    weakSubjects;
    createdAt;
    updatedAt;
}
exports.UserProfileDto = UserProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-string', description: 'User unique identifier' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'test@example.com', description: 'User email address' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John', description: 'User first name' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe', description: 'User last name' }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'STUDENT', description: 'User role in the system', enum: ['STUDENT', 'TEACHER', 'ADMIN', 'PARENT'] }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Whether user email is verified' }),
    __metadata("design:type", Boolean)
], UserProfileDto.prototype, "isEmailVerified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1990-01-01T00:00:00.000Z', description: 'User birth date', required: false }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, description: 'User age', required: false }),
    __metadata("design:type", Number)
], UserProfileDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'MALE', description: 'User gender', enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], required: false }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'GRADE_10', description: 'User grade level', enum: ['GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6', 'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12'], required: false }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'COMPLETED', description: 'User onboarding status', enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] }),
    __metadata("design:type", String)
], UserProfileDto.prototype, "onboardingStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { learningStyle: 'VISUAL', subjects: ['Math', 'Science'] }, description: 'User preferences and learning settings', required: false }),
    __metadata("design:type", Object)
], UserProfileDto.prototype, "preferences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Math', 'Physics'], description: 'Subjects where user needs improvement', type: [String] }),
    __metadata("design:type", Array)
], UserProfileDto.prototype, "weakSubjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z', description: 'Account creation date' }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-01-01T00:00:00.000Z', description: 'Last profile update date' }),
    __metadata("design:type", Date)
], UserProfileDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=auth.dto.js.map