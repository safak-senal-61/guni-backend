import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto, UpdateLessonDto } from './lessons.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLessonDto) {
    return this.prisma.lesson.create({ data });
  }

  async findAll() {
    return this.prisma.lesson.findMany();
  }

  async findOne(id: string) {
    return this.prisma.lesson.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateLessonDto) {
    return this.prisma.lesson.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.lesson.delete({ where: { id } });
  }
}
