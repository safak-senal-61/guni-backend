import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto, UpdateQuizDto } from './quizzes.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-roles.enum';

@ApiTags('quizzes')
@Controller('quizzes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'Yeni bir quiz oluştur',
    description: 'Sadece ADMIN ve TEACHER rolleri quiz oluşturabilir.'
  })
  @ApiResponse({ status: 201, description: 'Quiz başarıyla oluşturuldu.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri quiz oluşturabilir.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ 
    summary: 'Tüm quizleri getir',
    description: 'ADMIN, TEACHER ve STUDENT rolleri quizleri görüntüleyebilir.'
  })
  @ApiResponse({ status: 200, description: 'Tüm quizleri döndürür.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT)
  @ApiOperation({ 
    summary: 'ID ile quiz getir',
    description: 'ADMIN, TEACHER ve STUDENT rolleri quiz detaylarını görüntüleyebilir.'
  })
  @ApiResponse({ status: 200, description: 'Tek bir quiz döndürür.' })
  @ApiResponse({ status: 404, description: 'Quiz bulunamadı.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @ApiOperation({ 
    summary: 'ID ile quiz güncelle',
    description: 'Sadece ADMIN ve TEACHER rolleri quiz güncelleyebilir.'
  })
  @ApiResponse({ status: 200, description: 'Quiz başarıyla güncellendi.' })
  @ApiResponse({ status: 404, description: 'Quiz bulunamadı.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri quiz güncelleyebilir.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'ID ile quiz sil',
    description: 'Sadece ADMIN ve TEACHER rolleri quiz silebilir.'
  })
  @ApiResponse({ status: 204, description: 'Quiz başarıyla silindi.' })
  @ApiResponse({ status: 404, description: 'Quiz bulunamadı.' })
  @ApiResponse({ status: 403, description: 'Yetkisiz erişim - Sadece ADMIN ve TEACHER rolleri quiz silebilir.' })
  @ApiResponse({ status: 401, description: 'Kimlik doğrulama gerekli - Bearer token eksik veya geçersiz.' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }
}
