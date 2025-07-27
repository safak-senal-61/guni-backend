import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import { MailService } from '../src/mail/mail.service';

describe('Auth Extended (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const mockMailService = {
      sendEmailVerification: jest.fn().mockResolvedValue(undefined),
      sendPasswordReset: jest.fn().mockResolvedValue(undefined),
      sendPasswordChangeConfirmation: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(MailService)
    .useValue(mockMailService)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    
    prisma = app.get(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    await prisma.cleanDb();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.cleanDb();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user with email verification', async () => {
      const signupDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('email', signupDto.email);
      expect(response.body.message).toContain('doğrulayın');

      // Check user was created in database
      const user = await prisma.user.findUnique({
        where: { email: signupDto.email },
      });
      
      expect(user).toBeDefined();
      expect(user!.isEmailVerified).toBe(false);
      expect(user!.emailVerificationToken).toBeDefined();
      expect(user!.emailVerificationExpires).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      const signupDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      // First signup
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      // Second signup with same email
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(403);
    });

    it('should fail with invalid data', async () => {
      const invalidDto = {
        email: 'invalid-email',
        password: '123', // Too short
        firstName: '',
        lastName: '',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('POST /auth/signin', () => {
    it('should fail signin with unverified email', async () => {
      // Create user first
      const signupDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(signupDto)
        .expect(201);

      // Try to signin without email verification
      const signinDto = {
        email: signupDto.email,
        password: signupDto.password,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signinDto)
        .expect(403);

      expect(response.body.message).toContain('doğrulayın');
    });

    it('should signin successfully with verified email', async () => {
      // Create and verify user
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: '$argon2id$v=19$m=65536,t=3,p=4$8U1YsbED1+KhOXnyOF2xZw$HYQdbwGqr5EA/f+5KfzArnWe0GxNqU2itEyAJrw3m3g', // Valid argon2 hash for 'password123'
          firstName: 'Test',
          lastName: 'User',
          isEmailVerified: true,
        },
      });

      const signinDto = {
        email: user.email,
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(signinDto)
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });
  });

  describe('POST /auth/verify-email', () => {
    it('should verify email with valid token', async () => {
      // Create user with verification token
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          firstName: 'Test',
          lastName: 'User',
          emailVerificationToken: 'valid-token',
          emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({ token: 'valid-token' })
        .expect(200);

      expect(response.body.message).toContain('doğrulandı');

      // Check user is verified in database
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser!.isEmailVerified).toBe(true);
      expect(updatedUser!.emailVerificationToken).toBeNull();
      expect(updatedUser!.emailVerificationExpires).toBeNull();
    });

    it('should fail with invalid token', async () => {
      await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({ token: 'invalid-token' })
        .expect(400);
    });

    it('should fail with expired token', async () => {
      // Create user with expired token
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          firstName: 'Test',
          lastName: 'User',
          emailVerificationToken: 'expired-token',
          emailVerificationExpires: new Date(Date.now() - 1000), // Expired
        },
      });

      await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({ token: 'expired-token' })
        .expect(400);
    });
  });

  describe('POST /auth/resend-verification', () => {
    it('should resend verification for unverified user', async () => {
      // Create unverified user
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          firstName: 'Test',
          lastName: 'User',
          isEmailVerified: false,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/resend-verification')
        .send({ email: user.email })
        .expect(200);

      expect(response.body.message).toContain('gönderildi');

      // Check new token was generated
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser!.emailVerificationToken).toBeDefined();
      expect(updatedUser!.emailVerificationExpires).toBeDefined();
    });

    it('should fail for already verified user', async () => {
      // Create verified user
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          firstName: 'Test',
          lastName: 'User',
          isEmailVerified: true,
        },
      });

      await request(app.getHttpServer())
        .post('/auth/resend-verification')
        .send({ email: user.email })
        .expect(400);
    });

    it('should fail for non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/auth/resend-verification')
        .send({ email: 'nonexistent@example.com' })
        .expect(404);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send reset email for existing user', async () => {
      // Create user
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          firstName: 'Test',
          lastName: 'User',
          isEmailVerified: true,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: user.email })
        .expect(200);

      expect(response.body.message).toContain('gönderildi');

      // Check reset token was generated
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser!.passwordResetToken).toBeDefined();
      expect(updatedUser!.passwordResetExpires).toBeDefined();
    });

    it('should return same message for non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      expect(response.body.message).toContain('gönderildi');
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should reset password with valid token', async () => {
      // Create user with reset token
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'oldhashedpassword',
          firstName: 'Test',
          lastName: 'User',
          passwordResetToken: 'valid-reset-token',
          passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: 'valid-reset-token',
          newPassword: 'newpassword123',
        })
        .expect(200);

      expect(response.body.message).toContain('değiştirildi');

      // Check password was changed and tokens cleared
      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      
      expect(updatedUser).toBeDefined();
      expect(updatedUser!.password).not.toBe('oldhashedpassword');
      expect(updatedUser!.passwordResetToken).toBeNull();
      expect(updatedUser!.passwordResetExpires).toBeNull();
    });

    it('should fail with invalid token', async () => {
      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'newpassword123',
        })
        .expect(400);
    });

    it('should fail with expired token', async () => {
      // Create user with expired reset token
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          firstName: 'Test',
          lastName: 'User',
          passwordResetToken: 'expired-token',
          passwordResetExpires: new Date(Date.now() - 1000), // Expired
        },
      });

      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .send({
          token: 'expired-token',
          newPassword: 'newpassword123',
        })
        .expect(400);
    });
  });
});