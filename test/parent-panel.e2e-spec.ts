import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { UserRole } from './../src/common/enums/user-roles.enum';


describe('ParentPanelController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let parentAccessToken: string;
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
    const parentUser = { email: 'parent-panel@example.com', password: 'parentpassword', firstName: 'Parent', lastName: 'User' };
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(parentUser);
    
    // Verify parent user email and set role
    await prisma.user.update({
      where: { email: parentUser.email },
      data: { 
        role: UserRole.PARENT,
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null
      },
    });
    
    const parentSigninRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: parentUser.email, password: parentUser.password });
    parentAccessToken = parentSigninRes.body.accessToken;

    const studentUser = { email: 'student-panel-for-parent@example.com', password: 'studentpassword', firstName: 'Student', lastName: 'User' };
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

  describe('Get Profile', () => {
    it('should allow PARENT to get their profile', () => {
      return request(app.getHttpServer())
        .get('/parent-panel/profile')
        .set('Authorization', `Bearer ${parentAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('email', 'parent-panel@example.com');
          expect(res.body).toHaveProperty('role', UserRole.PARENT);
        });
    });

    it('should forbid STUDENT from getting parent profile', () => {
      return request(app.getHttpServer())
        .get('/parent-panel/profile')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .expect(403);
    });

    it('should return 401 if no token is provided', () => {
      return request(app.getHttpServer())
        .get('/parent-panel/profile')
        .expect(401);
    });
  });
});
