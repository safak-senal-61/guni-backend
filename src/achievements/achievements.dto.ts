import { IsString, IsEnum, IsInt, Min, IsOptional, IsBoolean } from 'class-validator';
import { AchievementCategory } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAchievementDto {
  @ApiProperty({
    description: 'Title of the achievement',
    example: 'Quiz Master'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the achievement',
    example: 'Complete 10 quizzes with 80% or higher score'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Category of the achievement',
    enum: AchievementCategory
  })
  @IsEnum(AchievementCategory)
  category: AchievementCategory;

  @ApiProperty({
    description: 'Points awarded for this achievement',
    example: 100,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  points: number;

  @ApiPropertyOptional({
    description: 'Icon identifier for the achievement',
    example: 'trophy-icon'
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({
    description: 'Requirement value to unlock this achievement',
    example: 10,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  requirement: number;
}

export class UpdateAchievementDto {
  @ApiPropertyOptional({
    description: 'Title of the achievement',
    example: 'Quiz Master'
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Description of the achievement',
    example: 'Complete 10 quizzes with 80% or higher score'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Category of the achievement',
    enum: AchievementCategory
  })
  @IsOptional()
  @IsEnum(AchievementCategory)
  category?: AchievementCategory;

  @ApiPropertyOptional({
    description: 'Points awarded for this achievement',
    example: 100,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;

  @ApiPropertyOptional({
    description: 'Icon identifier for the achievement',
    example: 'trophy-icon'
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Requirement value to unlock this achievement',
    example: 10,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  requirement?: number;

  @ApiPropertyOptional({
    description: 'Whether the achievement is active',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}