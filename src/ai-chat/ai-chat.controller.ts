import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AiChatService } from './ai-chat.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AI Chat')
@Controller('ai-chat')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('send-message')
  @ApiOperation({ summary: 'Kullanıcının AI ile sohbet etmesi için mesaj gönderme' })
  @ApiResponse({ status: 200, description: 'AI yanıtı başarıyla alındı' })
  async sendMessage(
    @Request() req,
    @Body() body: { message: string; context?: string }
  ) {
    return this.aiChatService.processMessage(
      req.user.userId,
      body.message,
      body.context
    );
  }

  @Get('conversation-history')
  @ApiOperation({ summary: 'Kullanıcının sohbet geçmişini getirme' })
  @ApiResponse({ status: 200, description: 'Sohbet geçmişi başarıyla alındı' })
  async getConversationHistory(
    @Request() req,
    @Query('limit') limit?: number
  ) {
    return this.aiChatService.getConversationHistory(
      req.user.userId,
      limit || 20
    );
  }

  @Post('get-study-suggestions')
  @ApiOperation({ summary: 'Kullanıcının durumuna göre çalışma önerileri alma' })
  @ApiResponse({ status: 200, description: 'Çalışma önerileri başarıyla oluşturuldu' })
  async getStudySuggestions(
    @Request() req,
    @Body() body: { subject?: string; difficulty?: string }
  ) {
    return this.aiChatService.generateStudySuggestions(
      req.user.userId,
      body.subject,
      body.difficulty
    );
  }

  @Post('explain-topic')
  @ApiOperation({ summary: 'Belirli bir konunun AI tarafından açıklanması' })
  @ApiResponse({ status: 200, description: 'Konu açıklaması başarıyla oluşturuldu' })
  async explainTopic(
    @Request() req,
    @Body() body: { topic: string; subject: string; level?: string }
  ) {
    return this.aiChatService.explainTopic(
      req.user.userId,
      body.topic,
      body.subject,
      body.level
    );
  }

  @Post('motivational-support')
  @ApiOperation({ summary: 'Kullanıcıya motivasyon desteği sağlama' })
  @ApiResponse({ status: 200, description: 'Motivasyon desteği başarıyla oluşturuldu' })
  async getMotivationalSupport(
    @Request() req,
    @Body() body: { mood?: string; challenge?: string }
  ) {
    return this.aiChatService.provideMotivationalSupport(
      req.user.userId,
      body.mood,
      body.challenge
    );
  }
}