import { Controller, Post, Body } from '@nestjs/common';
import { ContentAnalysisService } from './content-analysis.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SummarizeContentDto, SummarizeFileDto, GenerateQuizQuestionsDto, AnalyzeContentWorkflowDto } from './content-analysis.dto';

@ApiTags('content-analysis')
@Controller('content-analysis')
export class ContentAnalysisController {
  constructor(private readonly contentAnalysisService: ContentAnalysisService) {}

  @Post('summarize')
  @ApiOperation({ 
    summary: 'AI kullanarak gelişmiş içerik özetleme',
    description: 'Herkes tarafından erişilebilir. LangChain ve Gemini 2.0 Flash ile güçlendirilmiş detaylı eğitimsel özetleme.'
  })
  @ApiResponse({ status: 201, description: 'İçerik başarıyla özetlendi' })
  @ApiResponse({ status: 400, description: 'Geçersiz istek verisi' })
  @ApiResponse({ status: 500, description: 'Sunucu hatası' })
  async summarize(
    @Body() dto: SummarizeContentDto,
  ) {
    const userId = 'public-user'; // Public access için sabit userId
    return this.contentAnalysisService.summarizeContent(
      dto.text,
      userId,
      dto.videoUrl,
      dto.title,
      dto.subject,
      dto.gradeLevel,
      dto.learningObjectives,
      dto.targetAudience,
      dto.difficultyLevel,
      dto.durationMinutes,
      dto.keyTopics,
      dto.summaryType,
    );
  }

  @Post('summarize-file')
  @ApiOperation({ 
    summary: 'AI kullanarak gelişmiş dosya içeriği özetleme',
    description: 'Herkes tarafından erişilebilir. LangChain ve Gemini 2.0 Flash ile güçlendirilmiş dosya özetleme.'
  })
  @ApiResponse({ status: 201, description: 'Dosya içeriği başarıyla özetlendi' })
  @ApiResponse({ status: 400, description: 'Geçersiz istek verisi' })
  @ApiResponse({ status: 500, description: 'Sunucu hatası' })
  async summarizeFile(
    @Body() dto: SummarizeFileDto,
  ) {
    const userId = 'public-user'; // Public access için sabit userId
    return this.contentAnalysisService.summarizeFileEnhanced(
      dto.filePath,
      userId,
      dto.title,
      dto.subject,
      dto.gradeLevel,
      dto.learningObjectives,
      dto.targetAudience,
      dto.difficultyLevel,
      dto.durationMinutes,
      dto.keyTopics,
      dto.summaryType,
    );
  }

  @Post('generate-quiz-questions')
  @ApiOperation({ 
    summary: 'LangChain ile gelişmiş quiz soruları oluşturma',
    description: 'Herkes tarafından erişilebilir. LangChain ve Gemini 2.0 Flash ile güçlendirilmiş quiz sorusu üretimi.'
  })
  @ApiResponse({ status: 201, description: 'Quiz soruları başarıyla oluşturuldu' })
  @ApiResponse({ status: 400, description: 'Geçersiz istek verisi' })
  @ApiResponse({ status: 500, description: 'Sunucu hatası' })
  async generateQuizQuestions(
    @Body() dto: GenerateQuizQuestionsDto,
  ) {
    const userId = 'public-user'; // Public access için sabit userId
    return this.contentAnalysisService.generateQuizQuestionsEnhanced(
      dto.text,
      dto.numberOfQuestions || 5,
      userId,
      dto.subject,
      dto.gradeLevel,
      dto.difficultyLevel,
      dto.questionType,
      dto.learningObjectives,
      dto.keyTopics,
      dto.language,
    );
  }

  @Post('analyze-workflow')
  @ApiOperation({ 
    summary: 'LangGraph workflow ile gelişmiş içerik analizi',
    description: 'Herkes tarafından erişilebilir. LangGraph workflow ve Gemini 2.0 Flash ile güçlendirilmiş içerik analizi.'
  })
  @ApiResponse({ status: 201, description: 'İçerik analizi başarıyla tamamlandı' })
  @ApiResponse({ status: 400, description: 'Geçersiz istek verisi' })
  @ApiResponse({ status: 500, description: 'Sunucu hatası' })
  async analyzeContentWorkflow(
    @Body() dto: AnalyzeContentWorkflowDto,
  ) {
    const userId = 'public-user'; // Public access için sabit userId
    return this.contentAnalysisService.analyzeContentWorkflowEnhanced(
      dto.text,
      userId,
      dto.analysisType?.toString(),
      dto.subject,
      dto.gradeLevel,
      dto.learningObjectives,
      dto.targetAudience,
      dto.difficultyLevel,
      dto.keyTopics,
      dto.analysisDepth,
      dto.includeRecommendations,
      dto.language,
    );
  }
}
