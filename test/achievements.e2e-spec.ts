import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { UserRole } from './../src/common/enums/user-roles.enum';
import { AchievementCategory } from '@prisma/client';

describe('AchievementsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminAccessToken: string;
  let studentAccessToken: string;
  let achievementId: string;
  let studentUserId: string;

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
    await prisma.notification.deleteMany();
    await prisma.videoAnalysis.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    const adminUser = { email: 'admin-achievements@example.com', password: 'adminpassword', firstName: 'Admin', lastName: 'User' };
    const adminSignupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(adminUser)
      .expect(201);
    
    // Wait a bit for the user to be created
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify admin user email and set role
    const adminUserRecord = await prisma.user.update({
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
    const studentUser = { email: 'student-achievements@example.com', password: 'studentpassword', firstName: 'Student', lastName: 'User' };
    const studentSignupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(studentUser)
      .expect(201);
    
    // Wait a bit for the user to be created
    await new Promise(resolve => setTimeout(resolve, 100));
    
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

    // Create lessons first
    const lessonIds: string[] = [];
    for (let i = 1; i <= 6; i++) {
      const lesson = await prisma.lesson.create({
        data: {
          title: `Test Lesson ${i}`,
          description: `Test lesson ${i} description`,
          subject: 'Mathematics',
          difficulty: 'beginner',
          type: 'LESSON',
        },
      });
      lessonIds.push(lesson.id);
    }

    // Create lesson progress for the student to meet achievement requirements
    for (const lessonId of lessonIds) {
      try {
        await prisma.lessonProgress.create({
          data: {
            userId: studentUserId,
            lessonId: lessonId,
            completed: true,
            progress: 100,
            lastAccessed: new Date(),
          },
        });
        console.log(`Created lesson progress for lesson ${lessonId}`);
      } catch (error) {
        console.error(`Error creating lesson progress for lesson ${lessonId}:`, error);
        throw error;
      }
    }
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.userAchievement.deleteMany();
      await prisma.achievement.deleteMany();
      await prisma.notification.deleteMany();
      await prisma.videoAnalysis.deleteMany();
      await prisma.lessonProgress.deleteMany();
      await prisma.lesson.deleteMany();
      await prisma.user.deleteMany();
    }
    if (app) {
      await app.close();
    }
  });

  describe('Achievement Management', () => {
    const createAchievementDto = {
      title: 'Test Achievement',
      description: 'Test achievement description',
      category: AchievementCategory.PROGRESS,
      points: 100,
      rarity: 'common',
      requirement: 5,
      icon: 'https://example.com/icon.png'
    };

    it('should allow ADMIN to create achievement', () => {
      return request(app.getHttpServer())
        .post('/achievements')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(createAchievementDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('title', createAchievementDto.title);
          expect(res.body).toHaveProperty('category', createAchievementDto.category);
          expect(res.body).toHaveProperty('points', createAchievementDto.points);
          achievementId = res.body.id;
        });
    });

    it('should forbid STUDENT from creating achievement', () => {
      return request(app.getHttpServer())
        .post('/achievements')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(createAchievementDto)
        .expect(403);
    });

    it('should get all achievements', () => {
      return request(app.getHttpServer())
        .get('/achievements')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('title');
          expect(res.body[0]).toHaveProperty('category');
          expect(res.body[0]).toHaveProperty('points');
        });
    });

    it('should get user achievements', () => {
      return request(app.getHttpServer())
        .get('/achievements/my-achievements')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('unlocked');
          expect(res.body).toHaveProperty('locked');
          expect(res.body).toHaveProperty('totalPoints');
          expect(res.body).toHaveProperty('unlockedCount');
          expect(res.body).toHaveProperty('totalCount');
          expect(Array.isArray(res.body.unlocked)).toBe(true);
          expect(Array.isArray(res.body.locked)).toBe(true);
        });
    });

    it('should unlock achievement for user', () => {
      return request(app.getHttpServer())
        .post(`/achievements/unlock/${achievementId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ userId: studentUserId })
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('userId');
          expect(res.body).toHaveProperty('achievementId', achievementId);
          expect(res.body).toHaveProperty('unlockedAt');
          expect(res.body).toHaveProperty('achievement');
        });
    });

    it('should check and unlock achievements', async () => {
      // Debug: Check user's lesson progress before calling the endpoint
      const userWithProgress = await prisma.user.findUnique({
        where: { id: studentUserId },
        include: {
          lessonsCompleted: true,
          quizzesTaken: true,
        },
      });
      
      // Verify we have the expected data
       expect(userWithProgress).toBeTruthy();
       expect(userWithProgress!.lessonsCompleted.length).toBe(6);
      
      try {
        const response = await request(app.getHttpServer())
          .post('/achievements/check-unlocks')
          .set('Authorization', `Bearer ${studentAccessToken}`);
        
        console.log('Response status:', response.status);
        console.log('Response body:', response.body);
        console.log('Response text:', response.text);
        
        expect(response.status).toBe(201);
        expect(Array.isArray(response.body)).toBe(true);
      } catch (error) {
        console.error('Test error:', error);
        throw error;
      }
    });

    it('should get leaderboard', () => {
      return request(app.getHttpServer())
        .get('/achievements/leaderboard')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('userId');
            expect(res.body[0]).toHaveProperty('name');
            expect(res.body[0]).toHaveProperty('totalPoints');
            expect(res.body[0]).toHaveProperty('achievementCount');
          }
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 401 if no token is provided', () => {
      return request(app.getHttpServer())
        .get('/achievements')
        .expect(401);
    });

    it('should return 404 for non-existent achievement', () => {
      return request(app.getHttpServer())
        .post('/achievements/non-existent-id/unlock')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);
    });

    it('should validate achievement creation data', () => {
      const invalidDto = {
        title: '', // Empty title
        description: 'Test',
        category: 'INVALID_CATEGORY',
        points: -10, // Negative points
        icon: 'https://example.com/icon.png'
      };

      return request(app.getHttpServer())
        .post('/achievements')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(invalidDto)
        .expect(400);
    });
  });
});