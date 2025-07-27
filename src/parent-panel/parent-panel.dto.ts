import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsDateString, IsArray, IsUUID } from 'class-validator';

export class ConnectStudentDto {
  @ApiProperty({
    description: 'Öğrencinin email adresi',
    example: 'student@example.com'
  })
  @IsEmail()
  studentEmail: string;

  @ApiPropertyOptional({
    description: 'Bağlantı için özel davet kodu',
    example: 'ABC123'
  })
  @IsOptional()
  @IsString()
  inviteCode?: string;
}

export class ApproveConnectionDto {
  @ApiProperty({
    description: 'Bağlantı ID\'si',
    example: 'uuid-string'
  })
  @IsUUID()
  connectionId: string;

  @ApiProperty({
    description: 'Bağlantı durumu',
    example: 'approved',
    enum: ['approved', 'rejected']
  })
  @IsEnum(['approved', 'rejected'])
  status: 'approved' | 'rejected';
}

export class GetProgressSummaryDto {
  @ApiProperty({
    description: 'Öğrenci ID\'si',
    example: 'uuid-string'
  })
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({
    description: 'Başlangıç tarihi (ISO format)',
    example: '2024-01-01T00:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Bitiş tarihi (ISO format)',
    example: '2024-01-07T23:59:59.999Z'
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class SendNotificationDto {
  @ApiProperty({
    description: 'Alıcı ID\'si',
    example: 'uuid-string'
  })
  @IsUUID()
  receiverId: string;

  @ApiProperty({
    description: 'Bildirim başlığı',
    example: 'Tebrikler!'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Bildirim mesajı',
    example: 'Matematik quizinde harika bir performans sergiledi!'
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Bildirim tipi',
    example: 'achievement',
    enum: ['achievement', 'progress', 'quiz_completed', 'lesson_completed', 'parent_request', 'encouragement']
  })
  @IsEnum(['achievement', 'progress', 'quiz_completed', 'lesson_completed', 'parent_request', 'encouragement'])
  type: string;

  @ApiPropertyOptional({
    description: 'Ek veri (JSON format)',
    example: { quizScore: 95, subject: 'Mathematics' }
  })
  @IsOptional()
  data?: any;
}

export class MarkNotificationReadDto {
  @ApiProperty({
    description: 'Bildirim ID\'si',
    example: 'uuid-string'
  })
  @IsUUID()
  notificationId: string;
}

export class GetStudentDetailedProgressDto {
  @ApiProperty({
    description: 'Öğrenci ID\'si',
    example: 'uuid-string'
  })
  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({
    description: 'Konu filtresi',
    example: 'Mathematics'
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({
    description: 'Sayfa numarası',
    example: 1
  })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    description: 'Sayfa başına kayıt sayısı',
    example: 10
  })
  @IsOptional()
  limit?: number;
}