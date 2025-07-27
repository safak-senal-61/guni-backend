import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto, UpdateLessonDto } from './lessons.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-roles.enum';

@ApiTags('lessons')
@Controller('lessons')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'Yeni bir ders oluştur',
    description: 'Sadece ADMIN ve TEACHER rolleri ders oluşturabilir.'
  })
  @ApiResponse({ status: 201, description: 'Ders başarıyla oluşturuldu.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri ders oluşturabilir.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ 
    summary: 'Tüm dersleri getir',
    description: 'ADMIN, TEACHER ve STUDENT rolleri dersleri görüntüleyebilir.'
  })
  @ApiResponse({ status: 200, description: 'Tüm dersleri döndürür.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ 
    summary: 'ID ile ders getir',
    description: 'ADMIN, TEACHER ve STUDENT rolleri ders detaylarını görüntüleyebilir.'
  })
  @ApiResponse({ status: 200, description: 'Tek bir ders döndürür.' })
  @ApiResponse({ status: 404, description: 'Ders bulunamadı.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'ID ile ders güncelle',
    description: 'Sadece ADMIN ve TEACHER rolleri ders güncelleyebilir.'
  })
  @ApiResponse({ status: 200, description: 'Ders başarıyla güncellendi.' })
  @ApiResponse({ status: 404, description: 'Ders bulunamadı.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri ders güncelleyebilir.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'ID ile ders sil',
    description: 'Sadece ADMIN ve TEACHER rolleri ders silebilir.'
  })
  @ApiResponse({ status: 204, description: 'Ders başarıyla silindi.' })
  @ApiResponse({ status: 404, description: 'Ders bulunamadı.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri ders silebilir.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.lessonsService.remove(id);
  }
}
