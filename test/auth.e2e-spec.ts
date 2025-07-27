import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.videoAnalysis.deleteMany(); // Delete related records first
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.videoAnalysis.deleteMany(); // Delete related records first
      await prisma.user.deleteMany();
    }
    if (app) {
      await app.close();
    }
  });

  describe('Auth', () => {
    const dto = { email: 'test@example.com', password: 'password123', firstName: 'Test', lastName: 'User' };
    let accessToken: string;
    let refreshToken: string;

    it('should signup', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(dto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('başarılı');
        });
    });

    it('should signin after email verification', async () => {
      // Verify email first
      await prisma.user.update({
        where: { email: dto.email },
        data: {
          isEmailVerified: true,
          emailVerificationToken: null,
          emailVerificationExpires: null
        },
      });
      
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: dto.email, password: dto.password })
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          accessToken = res.body.accessToken;
          refreshToken = res.body.refreshToken;
        });
    });

    it('should get current user', () => {
      return request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.email).toBe(dto.email);
        });
    });

    it('should refresh tokens', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${refreshToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
        });
    });

    it('should logout', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
