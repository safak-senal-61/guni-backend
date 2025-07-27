import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto, GetMessagesDto, GetConversationsDto } from './messages.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  async sendMessage(
    @Request() req,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(req.user.userId, createMessageDto);
  }

  @Get('conversations')
  async getUserConversations(
    @Request() req,
    @Query() query: GetConversationsDto,
  ) {
    return this.messagesService.getUserConversations(
      req.user.userId,
      query.page,
      query.limit,
    );
  }

  @Get('conversation/:userId')
  async getConversation(
    @Request() req,
    @Param('userId') otherUserId: string,
    @Query() query: GetMessagesDto,
  ) {
    return this.messagesService.getConversation(
      req.user.userId,
      otherUserId,
      query,
    );
  }

  @Get('unread-count')
  async getUnreadMessageCount(@Request() req) {
    return this.messagesService.getUnreadMessageCount(req.user.userId);
  }

  @Post('mark-read/:senderId')
  async markMessagesAsRead(
    @Request() req,
    @Param('senderId') senderId: string,
  ) {
    return this.messagesService.markMessagesAsRead(req.user.userId, senderId);
  }

  @Delete(':messageId')
  async deleteMessage(
    @Request() req,
    @Param('messageId') messageId: string,
  ) {
    return this.messagesService.deleteMessage(messageId, req.user.userId);
  }
}