import { IsString, IsEnum, IsInt, Min, IsOptional, IsBoolean } from 'class-validator';
import { AchievementCategory } from '@prisma/client';

export class CreateAchievementDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(AchievementCategory)
  category: AchievementCategory;

  @IsInt()
  @Min(1)
  points: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsInt()
  @Min(1)
  requirement: number;
}

export class UpdateAchievementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(AchievementCategory)
  category?: AchievementCategory;

  @IsOptional()
  @IsInt()
  @Min(1)
  points?: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  requirement?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}