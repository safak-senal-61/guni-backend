import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { Gender, GradeLevel, LearningStyle, OnboardingStatus } from '@prisma/client';

describe('UserOnboardingController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    
    // Clean up database
    await prisma.assessmentResult.deleteMany();
    await prisma.userProfile.deleteMany();
    await prisma.videoAnalysis.deleteMany();
    await prisma.user.deleteMany();

    // Create test user and get access token
    const testUser = {
      email: 'onboarding@test.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    };
    
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(testUser);
    
    // Verify user email
    await prisma.user.update({
      where: { email: testUser.email },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
    });
    
    // Sign in to get access token
    const signinResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: testUser.email, password: testUser.password });
    
    accessToken = signinResponse.body.accessToken;
    
    // Get user ID
    const userResponse = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);
    
    userId = userResponse.body.id;
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.assessmentResult.deleteMany();
      await prisma.userProfile.deleteMany();
      await prisma.videoAnalysis.deleteMany();
      await prisma.user.deleteMany();
    }
    if (app) {
      await app.close();
    }
  });

  describe('User Profile Management', () => {
    it('should update user profile', () => {
      const updateProfileDto = {
        age: 15,
        gender: Gender.MALE,
        gradeLevel: GradeLevel.GRADE_9,
        learningStyle: LearningStyle.VISUAL,
        interests: ['Mathematics', 'Science'],
        goals: ['Improve math skills', 'Prepare for exams'],
        studyHours: 3,
        difficultyPreference: 'medium',
        weakSubjects: ['Physics']
      };

      return request(app.getHttpServer())
        .put('/user-onboarding/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateProfileDto)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('user');
          expect(res.body).toHaveProperty('profile');
          expect(res.body.user).toHaveProperty('age', 15);
          expect(res.body.user).toHaveProperty('gender', Gender.MALE);
          expect(res.body.user).toHaveProperty('gradeLevel', GradeLevel.GRADE_9);
        });
    });

    it('should get user profile', () => {
      return request(app.getHttpServer())
        .get(`/user-onboarding/profile/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('onboardingStatus');
          expect(res.body).toHaveProperty('profile');
        });
    });
  });

  describe('Onboarding Quiz', () => {
    it('should generate onboarding quiz', () => {
      const quizDto = {
        subjects: ['Mathematics', 'Science'],
        questionsPerSubject: 3
      };

      return request(app.getHttpServer())
        .post('/user-onboarding/quiz/generate')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(quizDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('questions');
          expect(Array.isArray(res.body.questions)).toBe(true);
          expect(res.body.questions.length).toBeGreaterThan(0);
        });
    });

    it('should submit onboarding quiz', () => {
      const submitDto = {
        answers: [
          {
            questionId: 'q1',
            answer: 'Option A',
            subject: 'Mathematics'
          },
          {
            questionId: 'q2',
            answer: 'Option B',
            subject: 'Science'
          }
        ]
      };

      return request(app.getHttpServer())
        .post('/user-onboarding/quiz/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(submitDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('analysis');
          expect(res.body).toHaveProperty('weakSubjects');
          expect(res.body).toHaveProperty('recommendations');
          expect(Array.isArray(res.body.weakSubjects)).toBe(true);
        });
    });
  });

  describe('Personalized Homepage', () => {
    it('should generate personalized homepage (POST)', () => {
      const homepageDto = {
        lessonCount: 5,
        includeQuizzes: true,
        includeProgress: true
      };

      return request(app.getHttpServer())
        .post('/user-onboarding/homepage/personalized')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(homepageDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('personalizedContent');
          expect(res.body).toHaveProperty('recommendedLessons');
          expect(res.body).toHaveProperty('recommendedQuizzes');
          expect(res.body).toHaveProperty('progressAnalytics');
          expect(Array.isArray(res.body.recommendedLessons)).toBe(true);
        });
    });

    it('should get personalized homepage (GET)', () => {
      return request(app.getHttpServer())
        .get('/user-onboarding/homepage/personalized')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('personalizedContent');
          expect(res.body).toHaveProperty('recommendedLessons');
          expect(res.body).toHaveProperty('recommendedQuizzes');
          expect(res.body).toHaveProperty('progressAnalytics');
        });
    });
  });

  describe('Recommendations and Analytics', () => {
    it('should refresh recommendations', () => {
      return request(app.getHttpServer())
        .post('/user-onboarding/recommendations/refresh')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('personalizedContent');
          expect(res.body).toHaveProperty('recommendedLessons');
          expect(res.body).toHaveProperty('recommendedQuizzes');
          expect(Array.isArray(res.body.recommendedLessons)).toBe(true);
        });
    });

    it('should get weak subjects analytics', () => {
      return request(app.getHttpServer())
        .get('/user-onboarding/analytics/weak-subjects')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('weakSubjectsAnalysis');
          expect(res.body).toHaveProperty('aiRecommendations');
          expect(res.body.weakSubjectsAnalysis).toHaveProperty('subjects');
          expect(Array.isArray(res.body.weakSubjectsAnalysis.subjects)).toBe(true);
        });
    });
  });

  describe('Error Handling', () => {
    it('should return 401 for unauthorized requests', () => {
      return request(app.getHttpServer())
        .get('/user-onboarding/profile/123')
        .expect(401);
    });

    it('should return 400 for invalid profile data', () => {
      const invalidDto = {
        age: -5, // Invalid age
        gender: 'INVALID_GENDER'
      };

      return request(app.getHttpServer())
        .put('/user-onboarding/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 for empty quiz subjects', () => {
      const invalidQuizDto = {
        subjects: [], // Empty subjects array
        questionsPerSubject: 5
      };

      return request(app.getHttpServer())
        .post('/user-onboarding/quiz/generate')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidQuizDto)
        .expect(400);
    });

    it('should return 400 for empty quiz answers', () => {
      const invalidSubmitDto = {
        answers: [] // Empty answers array
      };

      return request(app.getHttpServer())
        .post('/user-onboarding/quiz/submit')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidSubmitDto)
        .expect(400);
    });
  });
});