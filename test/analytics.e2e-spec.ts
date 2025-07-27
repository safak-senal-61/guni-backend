import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { UserRole } from './../src/common/enums/user-roles.enum';
import { AchievementCategory } from '@prisma/client';

describe('AnalyticsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminAccessToken: string;
  let studentAccessToken: string;
  let parentAccessToken: string;
  let studentUserId: string;
  let parentUserId: string;
  let lessonId: string;
  let quizId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    
    // Clean up database
    await prisma.userAchievement.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.quizAttempt.deleteMany();
    await prisma.lessonProgress.deleteMany();
    await prisma.message.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.parentStudentConnection.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.videoAnalysis.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const adminUser = { email: 'admin-analytics@example.com', password: 'adminpassword', firstName: 'Admin', lastName: 'User' };
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
    
    // Sign in admin user to get access token
    const adminSigninRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: adminUser.email, password: adminUser.password });
    
    adminAccessToken = adminSigninRes.body.accessToken;

    // Create student user
    const studentUser = { email: 'student-analytics@example.com', password: 'studentpassword', firstName: 'Student', lastName: 'User' };
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(studentUser);
    
    // Verify student user email and set role
    const studentUserRecord = await prisma.user.update({
      where: { email: studentUser.email },
      data: { 
        role: UserRole.STUDENT,
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
    });
    studentUserId = studentUserRecord.id;
    
    // Sign in student user to get access token
    const studentSigninRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: studentUser.email, password: studentUser.password });
    
    studentAccessToken = studentSigninRes.body.accessToken;

    // Create parent user
    const parentUser = { email: 'parent-analytics@example.com', password: 'parentpassword', firstName: 'Parent', lastName: 'User' };
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(parentUser);
    
    // Verify parent user email and set role
    const parentUserRecord = await prisma.user.update({
      where: { email: parentUser.email },
      data: { 
        role: UserRole.PARENT,
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
    });
    parentUserId = parentUserRecord.id;
    
    // Sign in parent user to get access token
    const parentSigninRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: parentUser.email, password: parentUser.password });
    
    parentAccessToken = parentSigninRes.body.accessToken;

    // Create parent-student connection
    await prisma.parentStudentConnection.create({
      data: {
        parentId: parentUserId,
        studentId: studentUserId,
        connectionStatus: 'ACCEPTED',
      },
    });

    // Create test lesson
    const lesson = await prisma.lesson.create({
      data: {
        title: 'Test Lesson',
        content: 'Test lesson content',
        subject: 'MATH',
        difficulty: 'BEGINNER',
        type: 'LESSON',
      },
    });
    lessonId = lesson.id;

    // Create test quiz
    const quiz = await prisma.quiz.create({
      data: {
        title: 'Test Quiz',
        description: 'Test quiz description',
        subject: 'MATH',
        difficulty: 'BEGINNER',
        quizType: 'MULTIPLE_CHOICE',
        questionCount: 1,
        passingScore: 70,
        questions: {
          create: [
            {
              question: 'What is 2+2?',
              options: ['3', '4', '5', '6'],
              correctAnswer: 1,
              points: 10,
            },
          ],
        },
      },
    });
    quizId = quiz.id;

    // Create test data for analytics
    await prisma.lessonProgress.create({
      data: {
        userId: studentUserId,
        lessonId: lessonId,
        completed: true,
        timeSpent: 1800,
      },
    });

    await prisma.quizAttempt.create({
      data: {
        userId: studentUserId,
        quizId: quizId,
        score: 85,
        timeTaken: 300,
        answers: [{ question: 'What is 2+2?', answer: '4', correct: true }],
      },
    });

    await prisma.achievement.create({
      data: {
        title: 'Test Achievement',
        description: 'Test achievement for analytics',
        icon: 'https://example.com/icon.png',
        category: AchievementCategory.PROGRESS,
        points: 100,
        requirements: 1,
        rarity: 'common',
      },
    });

    await prisma.message.create({
      data: {
        senderId: studentUserId,
        receiverId: parentUserId,
        content: 'Test message for analytics',
      },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.userAchievement.deleteMany();
      await prisma.achievement.deleteMany();
      await prisma.quizAttempt.deleteMany();
      await prisma.lessonProgress.deleteMany();
      await prisma.message.deleteMany();
      await prisma.notification.deleteMany();
      await prisma.parentStudentConnection.deleteMany();
      await prisma.lesson.deleteMany();
      await prisma.quiz.deleteMany();
      await prisma.user.deleteMany();
    }
    if (app) {
      await app.close();
    }
  });

  describe('Overview Analytics', () => {
    it('should get overview analytics for admin', () => {
      return request(app.getHttpServer())
        .get('/analytics/overview')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('totalUsers');
          expect(res.body.data).toHaveProperty('totalLessons');
          expect(res.body.data).toHaveProperty('totalQuizzes');
          expect(res.body.data).toHaveProperty('usersByRole');
        });
    });

    it('should forbid non-admin from accessing overview analytics', () => {
      return request(app.getHttpServer())
        .get('/analytics/overview')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(403);
    });
  });

  describe('Parent Engagement Analytics', () => {
    it('should get parent engagement analytics for admin', () => {
      return request(app.getHttpServer())
        .get('/analytics/parent-engagement')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(res.body.data).toHaveProperty('totalConnections');
          expect(res.body.data).toHaveProperty('activeParents');
          expect(res.body.data).toHaveProperty('parentMessages');
        });
    });

    it('should forbid non-admin from accessing parent engagement analytics', () => {
      return request(app.getHttpServer())
        .get('/analytics/parent-engagement')
        .set('Authorization', `Bearer ${parentAccessToken}`)
        .expect(403);
    });
  });

  describe('Achievement Analytics', () => {
    it('should get achievement analytics for admin', () => {
      return request(app.getHttpServer())
        .get('/analytics/achievements')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(typeof res.body.data).toBe('object');
        });
    });

    it('should forbid non-admin from accessing achievement analytics', () => {
      return request(app.getHttpServer())
        .get('/analytics/achievements')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(403);
    });
  });

  describe('Learning Progress Analytics', () => {
    it('should get learning progress for admin', () => {
      return request(app.getHttpServer())
        .get('/analytics/learning-progress')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(typeof res.body.data).toBe('object');
        });
    });

    it('should forbid non-admin from accessing learning progress', () => {
      return request(app.getHttpServer())
        .get('/analytics/learning-progress')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(403);
    });
  });

  describe('Content Analytics', () => {
    it('should get content analytics for admin', () => {
      return request(app.getHttpServer())
        .get('/analytics/content')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('success', true);
          expect(res.body).toHaveProperty('data');
          expect(typeof res.body.data).toBe('object');
        });
    });
  });



  describe('Error Handling', () => {
    it('should return 401 if no token is provided', () => {
      return request(app.getHttpServer())
        .get('/analytics/overview')
        .expect(401);
    });

    it('should return 403 for unauthorized access to admin endpoints', () => {
      return request(app.getHttpServer())
        .get('/analytics/overview')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(403);
    });
  });
});