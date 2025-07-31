import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
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
    minLength: 6,
  })
  @IsString({ message: 'Şifre bir metin olmalıdır' })
  @MinLength(6, { message: 'Şifre en az 6 karakter olmalıdır' })
  @IsNotEmpty({ message: 'Şifre boş olamaz' })
  password: string;

  @ApiProperty({
    description: 'Ad',
    example: 'Ahmet',
  })
  @IsString({ message: 'Ad bir metin olmalıdır' })
  @IsNotEmpty({ message: 'Ad boş olamaz' })
  firstName: string;

  @ApiProperty({
    description: 'Soyad',
    example: 'Yılmaz',
  })
  @IsString({ message: 'Soyad bir metin olmalıdır' })
  @IsNotEmpty({ message: 'Soyad boş olamaz' })
  lastName: string;
}