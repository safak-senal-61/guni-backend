import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'E-posta adresi',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  @IsNotEmpty({ message: 'E-posta adresi boş olamaz' })
  email: string;

  @ApiProperty({
    description: 'Şifre',
    example: 'Sifre123!',
  })
  @IsString({ message: 'Şifre bir metin olmalıdır' })
  @IsNotEmpty({ message: 'Şifre boş olamaz' })
  password: string;
}