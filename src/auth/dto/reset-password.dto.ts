import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Şifre sıfırlama token\'ı',
    example: 'abc123def456ghi789',
  })
  @IsString({ message: 'Token bir metin olmalıdır' })
  @IsNotEmpty({ message: 'Token boş olamaz' })
  token: string;

  @ApiProperty({
    description: 'Yeni şifre',
    example: 'YeniSifre123!',
    minLength: 6,
  })
  @IsString({ message: 'Şifre bir metin olmalıdır' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  @IsNotEmpty({ message: 'Yeni şifre boş olamaz' })
  newPassword: string;
}