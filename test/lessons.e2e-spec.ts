import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { UserRole } from './../src/common/enums/user-roles.enum';
import { CreateLessonDto } from './../src/lessons/lessons.dto';

describe('LessonsController (e2e)', () => {
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
    await prisma.lesson.deleteMany();
    await prisma.user.deleteMany();

    // Create users for testing roles
    const adminUser = { email: 'admin@example.com', password: 'adminpassword', firstName: 'Admin', lastName: 'User' };
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

    const teacherUser = { email: 'teacher@example.com', password: 'teacherpassword', firstName: 'Teacher', lastName: 'User' };
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

    const studentUser = { email: 'student@example.com', password: 'studentpassword', firstName: 'Student', lastName: 'User' };
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
      await prisma.lesson.deleteMany();
      await prisma.user.deleteMany();
    }
    if (app) {
      await app.close();
    }
  });

  const createLessonDto: CreateLessonDto = {
    title: 'Test Lesson',
    description: 'A test description for the lesson.',
    subject: 'Math',
    topic: 'Algebra',
    difficulty: 'Easy',
    type: 'LESSON',
  };

  let lessonId: string;

  describe('Create Lesson', () => {
    it('should allow ADMIN to create a lesson', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createLessonDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          lessonId = res.body.id;
        });
    });

    it('should allow TEACHER to create a lesson', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send({ ...createLessonDto, title: 'Another Lesson' })
        .expect(201);
    });

    it('should forbid STUDENT from creating a lesson', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(createLessonDto)
        .expect(403);
    });
  });

  describe('Get Lessons', () => {
    it('should allow ADMIN to get all lessons', () => {
      return request(app.getHttpServer())
        .get('/lessons')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('should allow TEACHER to get all lessons', () => {
      return request(app.getHttpServer())
        .get('/lessons')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('should allow STUDENT to get all lessons', () => {
      return request(app.getHttpServer())
        .get('/lessons')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    it('should get a lesson by ID', () => {
      return request(app.getHttpServer())
        .get(`/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.id).toBe(lessonId);
        });
    });
  });

  describe('Update Lesson', () => {
    const updateLessonDto = { title: 'Updated Lesson Title' };

    it('should allow ADMIN to update a lesson', () => {
      return request(app.getHttpServer())
        .patch(`/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateLessonDto)
        .expect(200)
        .then((res) => {
          expect(res.body.title).toBe(updateLessonDto.title);
        });
    });

    it('should allow TEACHER to update a lesson', () => {
      return request(app.getHttpServer())
        .patch(`/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send({ title: 'Teacher Updated' })
        .expect(200);
    });

    it('should forbid STUDENT from updating a lesson', () => {
      return request(app.getHttpServer())
        .patch(`/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(updateLessonDto)
        .expect(403);
    });
  });

  describe('Delete Lesson', () => {
    it('should allow ADMIN to delete a lesson', () => {
      return request(app.getHttpServer())
        .delete(`/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(204);
    });

    it('should allow TEACHER to delete a lesson', async () => {
      const newLesson = await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .send(createLessonDto)
        .expect(201);

      return request(app.getHttpServer())
        .delete(`/lessons/${newLesson.body.id}`)
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .expect(204);
    });

    it('should forbid STUDENT from deleting a lesson', async () => {
      const newLesson = await request(app.getHttpServer())
        .post('/lessons')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createLessonDto)
        .expect(201);

      return request(app.getHttpServer())
        .delete(`/lessons/${newLesson.body.id}`)
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(403);
    });
  });
});
