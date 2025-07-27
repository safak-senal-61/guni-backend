import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ContentAnalysisService } from './content-analysis.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-roles.enum';
import { SummarizeContentDto, SummarizeFileDto, GenerateQuizQuestionsDto, AnalyzeContentWorkflowDto } from './content-analysis.dto';
import { Request } from 'express';

@ApiTags('content-analysis')
@Controller('content-analysis')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ContentAnalysisController {
  constructor(private readonly contentAnalysisService: ContentAnalysisService) {}

  @Post('summarize')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'AI kullanarak içerik özetleme',
    description: 'Sadece ADMIN ve TEACHER rolleri AI ile içerik özetleyebilir.'
  })
  @ApiResponse({ status: 201, description: 'İçerik başarıyla özetlendi' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri erişebilir.' })
  @ApiBearerAuth()
  async summarize(
    @Body() dto: SummarizeContentDto,
    @Req() req: Request,
  ) {
    const user = req.user as Express.User;
    const userId = user.id;
    return this.contentAnalysisService.summarizeContent(
      dto.text,
      userId,
      dto.videoUrl,
      dto.title,
    );
  }

  @Post('summarize-file')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'AI kullanarak dosya içeriğini özetleme',
    description: 'Sadece ADMIN ve TEACHER rolleri AI ile dosya içeriğini özetleyebilir.'
  })
  @ApiResponse({ status: 201, description: 'Dosya içeriği başarıyla özetlendi' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri erişebilir.' })
  @ApiBearerAuth()
  async summarizeFile(
    @Body() dto: SummarizeFileDto,
    @Req() req: Request,
  ) {
    const user = req.user as Express.User;
    const userId = user.id;
    return this.contentAnalysisService.summarizeFile(
      dto.filePath,
      userId,
      dto.title,
    );
  }

  @Post('generate-quiz-questions')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'LangGraph ile gelişmiş quiz soruları oluşturma',
    description: 'Sadece ADMIN ve TEACHER rolleri LangGraph workflow kullanarak AI ile quiz soruları oluşturabilir. Gemini 2.0 Flash modeli ile güçlendirilmiştir.'
  })
  @ApiResponse({ status: 201, description: 'Quiz soruları başarıyla oluşturuldu' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri erişebilir.' })
  @ApiBearerAuth()
  async generateQuizQuestions(
    @Body() dto: GenerateQuizQuestionsDto,
  ) {
    return this.contentAnalysisService.generateQuizQuestions(
      dto.text,
      dto.numberOfQuestions,
    );
  }

  @Post('analyze-workflow')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'LangGraph workflow ile gelişmiş içerik analizi',
    description: 'Sadece ADMIN ve TEACHER rolleri LangGraph workflow kullanarak kapsamlı içerik analizi yapabilir. Gemini 2.0 Flash modeli ile çoklu adımlı analiz sunar.'
  })
  @ApiResponse({ status: 201, description: 'İçerik analizi başarıyla tamamlandı' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri erişebilir.' })
  @ApiBearerAuth()
  async analyzeContentWithWorkflow(
    @Body() dto: AnalyzeContentWorkflowDto,
    @Req() req: Request,
  ) {
    const user = req.user as Express.User;
    const userId = user.id;
    return this.contentAnalysisService.analyzeContentWithWorkflow(
      dto.text,
      userId,
      dto.analysisType,
    );
  }
}
