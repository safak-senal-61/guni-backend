import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Mevcut şifre',
    example: 'EskiSifre123!',
  })
  @IsString({ message: 'Mevcut şifre bir metin olmalıdır' })
  @IsNotEmpty({ message: 'Mevcut şifre boş olamaz' })
  currentPassword: string;

  @ApiProperty({
    description: 'Yeni şifre',
    example: 'YeniSifre123!',
    minLength: 6,
  })
  @IsString({ message: 'Yeni şifre bir metin olmalıdır' })
  @MinLength(6, { message: 'Yeni şifre en az 6 karakter olmalıdır' })
  @IsNotEmpty({ message: 'Yeni şifre boş olamaz' })
  newPassword: string;
}