import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsEnum } from 'class-validator';

export class SummarizeContentDto {
  @ApiProperty({ description: 'Text content to summarize', required: true })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'URL of the video (optional)', required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ description: 'Title of the content (optional)', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Subject area (e.g., Mathematics, Science, History)', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Grade level (e.g., 5th Grade, 8th Grade, High School)', required: false })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiProperty({ description: 'Learning objectives or goals', required: false })
  @IsOptional()
  @IsString()
  learningObjectives?: string;

  @ApiProperty({ description: 'Target audience (e.g., students, teachers, parents)', required: false })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiProperty({ description: 'Difficulty level (beginner, intermediate, advanced)', required: false })
  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @ApiProperty({ description: 'Duration of the content in minutes', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiProperty({ description: 'Key topics or keywords to focus on', required: false })
  @IsOptional()
  @IsString()
  keyTopics?: string;

  @ApiProperty({ description: 'Type of summary needed (brief, detailed, educational)', required: false, default: 'educational' })
  @IsOptional()
  @IsString()
  summaryType?: string;
}

export class SummarizeFileDto {
  @ApiProperty({ description: 'Path to the file to summarize' })
  @IsString()
  @IsNotEmpty()
  filePath: string;

  @ApiProperty({ description: 'Title of the content (optional)', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Subject area (e.g., Mathematics, Science, History)', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Grade level (e.g., 5th Grade, 8th Grade, High School)', required: false })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiProperty({ description: 'Learning objectives or goals', required: false })
  @IsOptional()
  @IsString()
  learningObjectives?: string;

  @ApiProperty({ description: 'Target audience (e.g., students, teachers, parents)', required: false })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiProperty({ description: 'Difficulty level (beginner, intermediate, advanced)', required: false })
  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @ApiProperty({ description: 'Duration of the content in minutes', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiProperty({ description: 'Key topics or keywords to focus on', required: false })
  @IsOptional()
  @IsString()
  keyTopics?: string;

  @ApiProperty({ description: 'Type of summary needed (brief, detailed, educational)', required: false, default: 'educational' })
  @IsOptional()
  @IsString()
  summaryType?: string;
}

export class GenerateQuizQuestionsDto {
  @ApiProperty({ description: 'Text content to generate questions from' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ description: 'Number of questions to generate', required: false, default: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  numberOfQuestions?: number;

  @ApiProperty({ description: 'Subject area (e.g., Mathematics, Science, History)', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Grade level (e.g., 5th Grade, 8th Grade, High School)', required: false })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiProperty({ description: 'Difficulty level (easy, medium, hard)', required: false, default: 'medium' })
  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @ApiProperty({ description: 'Question type (multiple-choice, true-false, fill-blank)', required: false, default: 'multiple-choice' })
  @IsOptional()
  @IsString()
  questionType?: string;

  @ApiProperty({ description: 'Learning objectives to focus on', required: false })
  @IsOptional()
  @IsString()
  learningObjectives?: string;

  @ApiProperty({ description: 'Key topics or keywords to emphasize', required: false })
  @IsOptional()
  @IsString()
  keyTopics?: string;

  @ApiProperty({ description: 'Language for questions (Turkish, English)', required: false, default: 'Turkish' })
  @IsOptional()
  @IsString()
  language?: string;
}

export enum AnalysisType {
  SUMMARY = 'summary',
  DETAILED = 'detailed',
  EDUCATIONAL = 'educational'
}

export class AnalyzeContentWorkflowDto {
  @ApiProperty({ description: 'Text content to analyze with LangGraph workflow' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ 
    description: 'Type of analysis to perform', 
    enum: AnalysisType, 
    required: false, 
    default: AnalysisType.SUMMARY 
  })
  @IsOptional()
  @IsEnum(AnalysisType)
  analysisType?: AnalysisType;

  @ApiProperty({ description: 'Subject area (e.g., Mathematics, Science, History)', required: false })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Grade level (e.g., 5th Grade, 8th Grade, High School)', required: false })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiProperty({ description: 'Learning objectives or goals', required: false })
  @IsOptional()
  @IsString()
  learningObjectives?: string;

  @ApiProperty({ description: 'Target audience (e.g., students, teachers, parents)', required: false })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiProperty({ description: 'Difficulty level (beginner, intermediate, advanced)', required: false })
  @IsOptional()
  @IsString()
  difficultyLevel?: string;

  @ApiProperty({ description: 'Key topics or keywords to focus on', required: false })
  @IsOptional()
  @IsString()
  keyTopics?: string;

  @ApiProperty({ description: 'Analysis depth (shallow, moderate, deep)', required: false, default: 'moderate' })
  @IsOptional()
  @IsString()
  analysisDepth?: string;

  @ApiProperty({ description: 'Include educational recommendations', required: false, default: true })
  @IsOptional()
  includeRecommendations?: boolean;

  @ApiProperty({ description: 'Language for analysis output (Turkish, English)', required: false, default: 'Turkish' })
  @IsOptional()
  @IsString()
  language?: string;
}