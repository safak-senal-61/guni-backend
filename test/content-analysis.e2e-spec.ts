import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { UserRole } from './../src/common/enums/user-roles.enum';

describe('ContentAnalysisController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminAccessToken: string;
  let studentAccessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.videoAnalysis.deleteMany(); // Clean up related records first
    await prisma.user.deleteMany(); // Clean up users before tests

    // Create an admin user
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'admin@example.com', password: 'adminpassword', firstName: 'Admin', lastName: 'User' });
    
    // Verify admin user email and set role
    await prisma.user.update({
      where: { email: 'admin@example.com' },
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
      .send({ email: 'admin@example.com', password: 'adminpassword' });
    
    adminAccessToken = adminSigninRes.body.accessToken;

    // Create a student user
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'student@example.com', password: 'studentpassword', firstName: 'Student', lastName: 'User' });
    
    // Verify student user email and set role
    await prisma.user.update({
      where: { email: 'student@example.com' },
      data: { 
        role: UserRole.STUDENT,
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
    });
    
    // Sign in student user to get access token
    const studentSigninRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'student@example.com', password: 'studentpassword' });
    
    studentAccessToken = studentSigninRes.body.accessToken;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.videoAnalysis.deleteMany(); // Clean up related records first
      await prisma.user.deleteMany(); // Clean up users after tests
    }
    if (app) {
      await app.close();
    }
  });

  describe('Summarize Content', () => {
    const summarizeDto = {
      text: 'This is a test text for summarization. It should be summarized by the AI.',
      title: 'Test Summary',
    };

    it('should allow ADMIN to summarize content', () => {
      return request(app.getHttpServer())
        .post('/content-analysis/summarize')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(summarizeDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('summary');
          expect(res.body.summary).toBeDefined();
          expect(res.body.summary).not.toBeNull();
        });
    });

    it('should forbid STUDENT from summarizing content', () => {
      return request(app.getHttpServer())
        .post('/content-analysis/summarize')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send(summarizeDto)
        .expect(403); // Forbidden
    });

    it('should return 401 if no token is provided', () => {
      return request(app.getHttpServer())
        .post('/content-analysis/summarize')
        .send(summarizeDto)
        .expect(401); // Unauthorized
    });
  });

  describe('Generate Quiz Questions', () => {
    const quizText = 'The capital of France is Paris. It is known for the Eiffel Tower.';

    it('should allow ADMIN to generate quiz questions', () => {
      return request(app.getHttpServer())
        .post('/content-analysis/generate-quiz-questions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ text: quizText, numberOfQuestions: 1 })
        .expect(201)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('question');
          expect(res.body[0]).toHaveProperty('options');
          expect(res.body[0]).toHaveProperty('correctAnswer');
        });
    });

    it('should forbid STUDENT from generating quiz questions', () => {
      return request(app.getHttpServer())
        .post('/content-analysis/generate-quiz-questions')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .send({ text: quizText, numberOfQuestions: 1 })
        .expect(403);
    });
  });
});
