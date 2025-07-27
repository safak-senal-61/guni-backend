import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto, UpdateQuizDto } from './quizzes.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateQuizDto) {
    return this.prisma.quiz.create({ data });
  }

  async findAll() {
    return this.prisma.quiz.findMany();
  }

  async findOne(id: string) {
    return this.prisma.quiz.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateQuizDto) {
    return this.prisma.quiz.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.quiz.delete({ where: { id } });
  }
}
