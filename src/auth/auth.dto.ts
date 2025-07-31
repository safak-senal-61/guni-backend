import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'test@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class SignupDto extends AuthDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'test@example.com', description: 'User email' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'abc123def456', description: 'Password reset token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldpassword123', description: 'Current password' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newpassword123', description: 'New password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'abc123def456', description: 'Email verification token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ResendVerificationDto {
  @ApiProperty({ example: 'test@example.com', description: 'User email' })
  @IsEmail()
  email: string;
}

export class RefreshTokenDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 
    description: 'Refresh token to get new access token' 
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AuthResponseDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 
    description: 'JWT access token (expires in 15 minutes)' 
  })
  accessToken: string;

  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 
    description: 'JWT refresh token (expires in 7 days)' 
  })
  refreshToken: string;
}

export class UserProfileDto {
  @ApiProperty({ example: 'uuid-string', description: 'User unique identifier' })
  id: string;

  @ApiProperty({ example: 'test@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  lastName: string;

  @ApiProperty({ example: 'STUDENT', description: 'User role in the system', enum: ['STUDENT', 'TEACHER', 'ADMIN', 'PARENT'] })
  role: string;

  @ApiProperty({ example: true, description: 'Whether user email is verified' })
  isEmailVerified: boolean;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z', description: 'User birth date', required: false })
  dateOfBirth?: Date;

  @ApiProperty({ example: 25, description: 'User age', required: false })
  age?: number;

  @ApiProperty({ example: 'MALE', description: 'User gender', enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'], required: false })
  gender?: string;

  @ApiProperty({ example: 'GRADE_10', description: 'User grade level', enum: ['GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6', 'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12'], required: false })
  gradeLevel?: string;

  @ApiProperty({ example: 'COMPLETED', description: 'User onboarding status', enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] })
  onboardingStatus: string;

  @ApiProperty({ example: { learningStyle: 'VISUAL', subjects: ['Math', 'Science'] }, description: 'User preferences and learning settings', required: false })
  preferences?: any;

  @ApiProperty({ example: ['Math', 'Physics'], description: 'Subjects where user needs improvement', type: [String] })
  weakSubjects: string[];

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Account creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last profile update date' })
  updatedAt: Date;
}