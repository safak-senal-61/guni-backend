import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { UserRole } from './../src/common/enums/user-roles.enum';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('UploadsController (e2e)', () => {
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
    const adminUser = { email: 'admin-upload@example.com', password: 'adminpassword', firstName: 'Admin', lastName: 'User' };
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

    const teacherUser = { email: 'teacher-upload@example.com', password: 'teacherpassword', firstName: 'Teacher', lastName: 'User' };
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

    const studentUser = { email: 'student-upload@example.com', password: 'studentpassword', firstName: 'Student', lastName: 'User' };
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
    // Clean up uploaded files
    const uploadDir = path.join(__dirname, '..', 'uploads');
    try {
      const files = await fs.readdir(uploadDir);
      for (const file of files) {
        await fs.unlink(path.join(uploadDir, file));
      }
    } catch (error) {
      // Ignore if directory doesn't exist or other cleanup issues
    }
  });

  describe('Upload File', () => {
    const testFilePath = path.join(__dirname, 'test-file.txt');

    beforeAll(async () => {
      await fs.writeFile(testFilePath, 'This is a test file content.');
    });

    afterAll(async () => {
      await fs.unlink(testFilePath);
    });

    it('should allow ADMIN to upload a file', () => {
      return request(app.getHttpServer())
        .post('/uploads/file')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .attach('file', testFilePath)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('filename');
          expect(res.body.originalname).toBe('test-file.txt');
        });
    });

    it('should allow TEACHER to upload a file', () => {
      return request(app.getHttpServer())
        .post('/uploads/file')
        .set('Authorization', `Bearer ${teacherAccessToken}`)
        .attach('file', testFilePath)
        .expect(201);
    });

    it('should forbid STUDENT from uploading a file', () => {
      return request(app.getHttpServer())
        .post('/uploads/file')
        .set('Authorization', `Bearer ${studentAccessToken}`)
        .attach('file', testFilePath)
        .expect(403);
    });

    it('should return 401 if no token is provided', () => {
      return request(app.getHttpServer())
        .post('/uploads/file')
        .expect(401);
    });

    it('should accept any file type', () => {
      const invalidFilePath = path.join(__dirname, 'test-file.jpg');
      return fs.writeFile(invalidFilePath, 'test content')
        .then(() => {
          return request(app.getHttpServer())
            .post('/uploads/file')
            .set('Authorization', `Bearer ${adminAccessToken}`)
            .attach('file', invalidFilePath)
            .expect(201);
        })
        .finally(async () => {
          await fs.unlink(invalidFilePath);
        });
    });
  });
});
