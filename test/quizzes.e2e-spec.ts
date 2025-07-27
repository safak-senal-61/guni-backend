import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { UserRole } from './../src/common/enums/user-roles.enum';
import { CreateQuizDto } from './../src/quizzes/quizzes.dto';
import { QuizType } from '@prisma/client';

describe('QuizzesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminAccessToken: string;
  let teacherAccessToken: string;
  let studentAccessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.videoAnalysis.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.user.deleteMany();

    // Create users for testing roles
    const adminUser = { email: 'admin-quiz@example.com', password: 'adminpassword', firstName: 'Admin', lastName: 'User' };
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(adminUser);
    
    // Verify admin user email and set role
    await prisma.user.update({
      where: { email: adminUser.email },
      data: { 
        role: UserRole.ADMIN,
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
    });
    
    const adminSigninRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: adminUser.email, password: adminUser.password });
    adminAccessToken = adminSigninRes.body.accessToken;

    const teacherUser = { email: 'teacher-quiz@example.com', password: 'teacherpassword', firstName: 'Teacher', lastName: 'User' };
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(teacherUser);
    
    // Verify teacher user email and set role
    await prisma.user.update({
      where: { email: teacherUser.email },
      data: { 
        role: UserRole.TEACHER,
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
    });
    
    const teacherSigninRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: teacherUser.email, password: teacherUser.password });
    teacherAccessToken = teacherSigninRes.body.accessToken;

    const studentUser = { email: 'student-quiz@example.com', password: 'studentpassword', firstName: 'Student', lastName: 'User' };
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(studentUser);
    
    // Verify student user email and set role
    await prisma.user.update({
      where: { email: studentUser.email },
      data: { 
        role: UserRole.STUDENT,
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
    });
    
    const studentSigninRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: studentUser.email, password: studentUser.password });
    studentAccessToken = studentSigninRes.body.accessToken;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.videoAnalysis.deleteMany();
      await prisma.quiz.deleteMany();
      await prisma.lesson.deleteMany();
      await prisma.user.deleteMany();
    }
    if (app) {
      await app.close();
    }
  });

  const createQuizDto: CreateQuizDto = {
    title: 'Test Quiz',
    description: 'A test description for the quiz.',
    subject: 'History',
    topic: 'World War II',
    difficulty: 'Medium',
    quizType: QuizType.MULTIPLE_CHOICE,
    questionCount: 5,
    passingScore: 60,
    questions: [{ question: 'Q1', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' }],
  };

  let quizId: string;

  describe('Create Quiz', () => {
    it('should allow ADMIN to create a quiz', () => {
      return request(app.getHttpServer())
        .post('/quizzes')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createQuizDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          quizId = res.body.id;
        });
    });

    it('should allow TEACHER to create a quiz', () => {
      return request(app.getHttpServer())
        .post('/quizzes')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send({ ...createQuizDto, title: 'Another Quiz' })
        .expect(201);
    });

    it('should forbid STUDENT from creating a quiz', () => {
      return request(app.getHttpServer())
        .post('/quizzes')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(createQuizDto)
        .expect(403);
    });
  });

  describe('Get Quizzes', () => {
    it('should allow ADMIN to get all quizzes', () => {
      return request(app.getHttpServer())
        .get('/quizzes')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('should allow TEACHER to get all quizzes', () => {
      return request(app.getHttpServer())
        .get('/quizzes')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('should allow STUDENT to get all quizzes', () => {
      return request(app.getHttpServer())
        .get('/quizzes')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('should get a quiz by ID', () => {
      return request(app.getHttpServer())
        .get(`/quizzes/${quizId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(quizId);
        });
    });
  });

  describe('Update Quiz', () => {
    const updateQuizDto = { title: 'Updated Quiz Title' };

    it('should allow ADMIN to update a quiz', () => {
      return request(app.getHttpServer())
        .patch(`/quizzes/${quizId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateQuizDto)
        .expect(200)
        .then((res) => {
          expect(res.body.title).toBe(updateQuizDto.title);
        });
    });

    it('should allow TEACHER to update a quiz', () => {
      return request(app.getHttpServer())
        .patch(`/quizzes/${quizId}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send({ title: 'Teacher Updated' })
        .expect(200);
    });

    it('should forbid STUDENT from updating a quiz', () => {
      return request(app.getHttpServer())
        .patch(`/quizzes/${quizId}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(updateQuizDto)
        .expect(403);
    });
  });

  describe('Delete Quiz', () => {
    it('should allow ADMIN to delete a quiz', () => {
      return request(app.getHttpServer())
        .delete(`/quizzes/${quizId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(204);
    });

    it('should allow TEACHER to delete a quiz', async () => {
      const newQuiz = await request(app.getHttpServer())
        .post('/quizzes')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send(createQuizDto)
        .expect(201);

      return request(app.getHttpServer())
        .delete(`/quizzes/${newQuiz.body.id}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect(204);
    });

    it('should forbid STUDENT from deleting a quiz', async () => {
      const newQuiz = await request(app.getHttpServer())
        .post('/quizzes')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createQuizDto)
        .expect(201);

      return request(app.getHttpServer())
        .delete(`/quizzes/${newQuiz.body.id}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(403);
    });
  });
});
