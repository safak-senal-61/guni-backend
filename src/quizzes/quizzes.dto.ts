import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, IsEnum, Min, Max } from 'class-validator';
import { QuizType } from '@prisma/client';

export class CreateQuizDto {
  @ApiProperty({ description: 'ID of the lesson this quiz belongs to (optional)', required: false })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiProperty({ description: 'Title of the quiz' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the quiz', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Subject of the quiz' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Topic of the quiz', required: false })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({ description: 'Difficulty level of the quiz' })
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({ enum: QuizType, description: 'Type of quiz (e.g., MULTIPLE_CHOICE, OPEN_ENDED)' })
  @IsEnum(QuizType)
  quizType: QuizType;

  @ApiProperty({ description: 'Number of questions in the quiz' })
  @IsInt()
  @Min(1)
  questionCount: number;

  @ApiProperty({ description: 'Passing score for the quiz (percentage)' })
  @IsInt()
  @Min(0)
  @Max(100)
  passingScore: number;

  @ApiProperty({ description: 'JSON array of question objects' })
  @IsNotEmpty()
  questions: any; // Consider a more specific type for questions if structure is known
}

export class UpdateQuizDto extends PartialType(CreateQuizDto) {}