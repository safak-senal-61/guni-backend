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
}

export class SummarizeFileDto {
  @ApiProperty({ description: 'Path to the file to summarize' })
  filePath: string;

  @ApiProperty({ description: 'Title of the content (optional)', required: false })
  title?: string;
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
}