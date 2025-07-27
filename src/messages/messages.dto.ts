import { IsString, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { MessageType } from '@prisma/client';

export class CreateMessageDto {
  @IsString()
  content: string;

  @IsString()
  receiverId: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;
}

export class GetMessagesDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 50;
}

export class GetConversationsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 20;
}