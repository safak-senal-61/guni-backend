import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, IsUrl, IsEnum } from 'class-validator';
import { ContentType } from '@prisma/client';

export class CreateLessonDto {
  @ApiProperty({ description: 'Title of the lesson' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description of the lesson', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Subject of the lesson' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Topic of the lesson', required: false })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({ description: 'Difficulty level of the lesson' })
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @ApiProperty({ enum: ContentType, description: 'Type of content (e.g., LESSON, VIDEO, QUIZ)' })
  @IsEnum(ContentType)
  type: ContentType;

  @ApiProperty({ description: 'Duration of the lesson in minutes', required: false })
  @IsOptional()
  @IsInt()
  duration?: number;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  @IsOptional()
  @IsUrl()
  thumbnail?: string;

  @ApiProperty({ type: [String], description: 'Tags for the lesson', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ type: [String], description: 'Prerequisites for the lesson', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisites?: string[];

  @ApiProperty({ type: [String], description: 'Learning objectives of the lesson', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learningObjectives?: string[];
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}