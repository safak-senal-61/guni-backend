import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsArray,
  Min,
  Max,
  ArrayNotEmpty,
} from 'class-validator';
import { Gender, GradeLevel, LearningStyle } from '@prisma/client';

export class UpdateUserProfileDto {
  @ApiPropertyOptional({ description: 'User age' })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(100)
  age?: number;

  @ApiPropertyOptional({ enum: Gender, description: 'User gender' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ enum: GradeLevel, description: 'User grade level' })
  @IsOptional()
  @IsEnum(GradeLevel)
  gradeLevel?: GradeLevel;

  @ApiPropertyOptional({ enum: LearningStyle, description: 'Preferred learning style' })
  @IsOptional()
  @IsEnum(LearningStyle)
  learningStyle?: LearningStyle;

  @ApiPropertyOptional({ type: [String], description: 'User interests' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ type: [String], description: 'Learning goals' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];

  @ApiPropertyOptional({ description: 'Preferred daily study hours' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  studyHours?: number;

  @ApiPropertyOptional({ description: 'Difficulty preference' })
  @IsOptional()
  @IsString()
  difficultyPreference?: string;

  @ApiPropertyOptional({ type: [String], description: 'Known weak subjects' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  weakSubjects?: string[];
}

export class OnboardingQuizDto {
  @ApiProperty({ type: [String], description: 'Subjects to assess' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  subjects: string[];

  @ApiPropertyOptional({ description: 'Number of questions per subject' })
  @IsOptional()
  @IsInt()
  @Min(3)
  @Max(10)
  questionsPerSubject?: number = 5;
}

export class OnboardingQuizAnswerDto {
  @ApiProperty({ description: 'Quiz question ID' })
  @IsString()
  questionId: string;

  @ApiProperty({ description: 'User answer' })
  @IsString()
  answer: string;

  @ApiProperty({ description: 'Subject of the question' })
  @IsString()
  subject: string;
}

export class SubmitOnboardingQuizDto {
  @ApiProperty({ type: [OnboardingQuizAnswerDto], description: 'Quiz answers' })
  @IsArray()
  @ArrayNotEmpty()
  answers: OnboardingQuizAnswerDto[];
}

export class PersonalizedHomepageDto {
  @ApiPropertyOptional({ description: 'Number of recommended lessons' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  lessonCount?: number = 10;

  @ApiPropertyOptional({ description: 'Include quiz recommendations' })
  @IsOptional()
  includeQuizzes?: boolean = true;

  @ApiPropertyOptional({ description: 'Include progress analytics' })
  @IsOptional()
  includeProgress?: boolean = true;
}