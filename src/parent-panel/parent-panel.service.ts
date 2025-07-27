import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectStudentDto, ApproveConnectionDto, GetProgressSummaryDto, SendNotificationDto, GetStudentDetailedProgressDto } from './parent-panel.dto';
import { UserRole } from '../common/enums/user-roles.enum';

export interface Recommendation {
  type: 'practice' | 'study_plan' | 'review';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
}

export interface WeeklyProgress {
  week: string;
  lessonsCompleted: number;
  quizzesCompleted: number;
  studyHours: number;
  averageScore: number;
}

@Injectable()
export class ParentPanelService {
  constructor(private prisma: PrismaService) {}

  // Veli profil bilgilerini getir
  async getParentProfile(parentId: string) {
    const parent = await this.prisma.user.findUnique({
      where: { id: parentId },
      include: {
        profile: true,
        parentConnections: {
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                gradeLevel: true,
                onboardingStatus: true
              }
            }
          },
          where: { connectionStatus: 'approved' }
        }
      }
    });

    if (!parent) {
      throw new NotFoundException('Veli bulunamadı');
    }

    return {
      id: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      role: parent.role,
      profile: parent.profile,
      connectedStudents: parent.parentConnections.map(conn => conn.student),
      totalConnectedStudents: parent.parentConnections.length
    };
  }

  // Öğrenci ile bağlantı kurma isteği gönder
  async requestStudentConnection(parentId: string, connectDto: ConnectStudentDto) {
    // Öğrenciyi email ile bul
    const student = await this.prisma.user.findUnique({
      where: { email: connectDto.studentEmail }
    });

    if (!student) {
      throw new NotFoundException('Bu email adresine sahip öğrenci bulunamadı');
    }

    if (student.role !== UserRole.STUDENT) {
      throw new BadRequestException('Bu kullanıcı bir öğrenci değil');
    }

    // Mevcut bağlantıyı kontrol et
    const existingConnection = await this.prisma.parentStudentConnection.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId: student.id
        }
      }
    });

    if (existingConnection) {
      throw new BadRequestException('Bu öğrenci ile zaten bir bağlantı mevcut');
    }

    // Bağlantı isteği oluştur
    const connection = await this.prisma.parentStudentConnection.create({
      data: {
        parentId,
        studentId: student.id,
        inviteCode: connectDto.inviteCode,
        connectionStatus: 'pending'
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Öğrenciye bildirim gönder
    await this.prisma.notification.create({
      data: {
        receiverId: student.id,
        title: 'Yeni Veli Bağlantı İsteği',
        message: `${connection.student.firstName} ${connection.student.lastName} adlı veli sizinle bağlantı kurmak istiyor.`,
        type: 'parent_request',
        data: {
          connectionId: connection.id,
          parentName: `${connection.student.firstName} ${connection.student.lastName}`
        }
      }
    });

    return {
      message: 'Bağlantı isteği gönderildi',
      connection: {
        id: connection.id,
        studentName: `${connection.student.firstName} ${connection.student.lastName}`,
        status: connection.connectionStatus
      }
    };
  }

  // Bekleyen bağlantı isteklerini getir
  async getPendingConnections(parentId: string) {
    const connections = await this.prisma.parentStudentConnection.findMany({
      where: {
        parentId,
        connectionStatus: 'pending'
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            gradeLevel: true
          }
        }
      },
      orderBy: { requestedAt: 'desc' }
    });

    return connections.map(conn => ({
      id: conn.id,
      student: conn.student,
      requestedAt: conn.requestedAt,
      inviteCode: conn.inviteCode
    }));
  }

  // Bağlı öğrencilerin listesini getir
  async getConnectedStudents(parentId: string) {
    const connections = await this.prisma.parentStudentConnection.findMany({
      where: {
        parentId,
        connectionStatus: 'approved'
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            gradeLevel: true,
            onboardingStatus: true,
            weakSubjects: true,
            lessonsCompleted: {
              where: {
                completed: true,
                createdAt: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Son 7 gün
                }
              }
            },
            quizzesTaken: {
              where: {
                completed: true,
                attemptDate: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Son 7 gün
                }
              }
            }
          }
        }
      },
      orderBy: { approvedAt: 'desc' }
    });

    return connections.map(conn => {
      const student = conn.student;
      const weeklyLessons = student.lessonsCompleted.length;
      const weeklyQuizzes = student.quizzesTaken.length;
      const averageScore = weeklyQuizzes > 0 
        ? student.quizzesTaken.reduce((sum, quiz) => sum + quiz.score, 0) / weeklyQuizzes 
        : 0;

      return {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        gradeLevel: student.gradeLevel,
        onboardingStatus: student.onboardingStatus,
        weakSubjects: student.weakSubjects,
        weeklyStats: {
          lessonsCompleted: weeklyLessons,
          quizzesTaken: weeklyQuizzes,
          averageScore: Math.round(averageScore)
        },
        connectionApprovedAt: conn.approvedAt
      };
    });
  }

  // Öğrenci detaylı ilerleme raporu
  async getStudentDetailedProgress(parentId: string, dto: GetStudentDetailedProgressDto) {
    // Veli-öğrenci bağlantısını kontrol et
    const connection = await this.prisma.parentStudentConnection.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId: dto.studentId
        },
        connectionStatus: 'approved'
      }
    });

    if (!connection) {
      throw new ForbiddenException('Bu öğrencinin verilerine erişim yetkiniz yok');
    }

    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;

    // Öğrenci bilgileri
    const student = await this.prisma.user.findUnique({
      where: { id: dto.studentId },
      include: {
        profile: true,
        lessonsCompleted: {
          include: {
            lesson: {
              select: {
                title: true,
                subject: true,
                difficulty: true
              }
            }
          },
          where: dto.subject ? {
            lesson: {
              subject: dto.subject
            }
          } : undefined,
          orderBy: { lastAccessed: 'desc' },
          skip,
          take: limit
        },
        quizzesTaken: {
          include: {
            quiz: {
              select: {
                title: true,
                subject: true,
                difficulty: true,
                passingScore: true
              }
            }
          },
          where: dto.subject ? {
            quiz: {
              subject: dto.subject
            }
          } : undefined,
          orderBy: { attemptDate: 'desc' },
          skip,
          take: limit
        },
        achievements: {
          include: {
            achievement: true
          },
          orderBy: { unlockedAt: 'desc' },
          take: 5
        }
      }
    });

    // Genel istatistikler
    const totalLessons = await this.prisma.lessonProgress.count({
      where: {
        userId: dto.studentId,
        completed: true,
        ...(dto.subject && {
          lesson: {
            subject: dto.subject
          }
        })
      }
    });

    const totalQuizzes = await this.prisma.quizAttempt.count({
      where: {
        userId: dto.studentId,
        completed: true,
        ...(dto.subject && {
          quiz: {
            subject: dto.subject
          }
        })
      }
    });

    const averageQuizScore = await this.prisma.quizAttempt.aggregate({
      where: {
        userId: dto.studentId,
        completed: true,
        ...(dto.subject && {
          quiz: {
            subject: dto.subject
          }
        })
      },
      _avg: {
        score: true
      }
    });

    const totalStudyTime = await this.prisma.lessonProgress.aggregate({
      where: {
        userId: dto.studentId,
        ...(dto.subject && {
          lesson: {
            subject: dto.subject
          }
        })
      },
      _sum: {
        timeSpent: true
      }
    });

    return {
      student: {
        id: student?.id,
        firstName: student?.firstName,
        lastName: student?.lastName,
        gradeLevel: student?.gradeLevel,
        weakSubjects: student?.weakSubjects,
        profile: student?.profile
      },
      statistics: {
        totalLessonsCompleted: totalLessons,
        totalQuizzesTaken: totalQuizzes,
        averageQuizScore: Math.round(averageQuizScore._avg.score || 0),
        totalStudyTimeMinutes: Math.round((totalStudyTime._sum.timeSpent || 0) / 60)
      },
      recentLessons: student?.lessonsCompleted?.map(lp => ({
        id: lp.id,
        lesson: lp.lesson,
        progress: lp.progress,
        timeSpent: Math.round(lp.timeSpent / 60), // minutes
        completedAt: lp.lastAccessed,
        completed: lp.completed
      })),
      recentQuizzes: student?.quizzesTaken?.map(qa => ({
        id: qa.id,
        quiz: qa.quiz,
        score: qa.score,
        passed: qa.score >= qa.quiz.passingScore,
        timeTaken: qa.timeTaken ? Math.round(qa.timeTaken / 60) : null, // minutes
        attemptDate: qa.attemptDate
      })),
      recentAchievements: student?.achievements?.map(ua => ({
        id: ua.achievement.id,
        title: ua.achievement.title,
        description: ua.achievement.description,
        category: ua.achievement.category,
        points: ua.achievement.points,
        unlockedAt: ua.unlockedAt
      })),
      pagination: {
        page,
        limit,
        totalLessons,
        totalQuizzes
      }
    };
  }

  // Öğrenciye bildirim gönder
  async sendNotificationToStudent(parentId: string, dto: SendNotificationDto) {
    // Veli-öğrenci bağlantısını kontrol et
    const connection = await this.prisma.parentStudentConnection.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId: dto.receiverId
        },
        connectionStatus: 'approved'
      }
    });

    if (!connection) {
      throw new ForbiddenException('Bu öğrenciye bildirim gönderme yetkiniz yok');
    }

    const notification = await this.prisma.notification.create({
      data: {
        senderId: parentId,
        receiverId: dto.receiverId,
        title: dto.title,
        message: dto.message,
        type: dto.type,
        data: dto.data
      }
    });

    return {
      message: 'Bildirim başarıyla gönderildi',
      notification: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt
      }
    };
  }

  // Veli bildirimlerini getir
  async getParentNotifications(parentId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const notifications = await this.prisma.notification.findMany({
      where: {
        receiverId: parentId
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            role: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    const totalNotifications = await this.prisma.notification.count({
      where: {
        receiverId: parentId
      }
    });

    const unreadCount = await this.prisma.notification.count({
      where: {
        receiverId: parentId,
        isRead: false
      }
    });

    return {
      notifications: notifications.map(notif => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        data: notif.data,
        isRead: notif.isRead,
        createdAt: notif.createdAt,
        sender: notif.sender
      })),
      pagination: {
        page,
        limit,
        total: totalNotifications,
        totalPages: Math.ceil(totalNotifications / limit)
      },
      unreadCount
    };
  }

  // Bildirimi okundu olarak işaretle
  async markNotificationAsRead(parentId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      throw new NotFoundException('Bildirim bulunamadı');
    }

    if (notification.receiverId !== parentId) {
      throw new ForbiddenException('Bu bildirimi okuma yetkiniz yok');
    }

    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    return { message: 'Bildirim okundu olarak işaretlendi' };
  }

  // Haftalık ilerleme özeti oluştur
  async generateWeeklyProgressSummary(parentId: string, studentId: string) {
    // Veli-öğrenci bağlantısını kontrol et
    const connection = await this.prisma.parentStudentConnection.findUnique({
      where: {
        parentId_studentId: {
          parentId,
          studentId
        },
        connectionStatus: 'approved'
      }
    });

    if (!connection) {
      throw new ForbiddenException('Bu öğrencinin verilerine erişim yetkiniz yok');
    }

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Haftanın başı (Pazar)
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6); // Haftanın sonu (Cumartesi)
    weekEnd.setHours(23, 59, 59, 999);

    // Bu hafta için mevcut özeti kontrol et
    let summary = await this.prisma.studentProgressSummary.findUnique({
      where: {
        studentId_parentId_weekStartDate: {
          studentId,
          parentId,
          weekStartDate: weekStart
        }
      }
    });

    // Haftalık veriler
    const weeklyLessons = await this.prisma.lessonProgress.count({
      where: {
        userId: studentId,
        completed: true,
        lastAccessed: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    const weeklyQuizzes = await this.prisma.quizAttempt.findMany({
      where: {
        userId: studentId,
        completed: true,
        attemptDate: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    });

    const averageScore = weeklyQuizzes.length > 0 
      ? weeklyQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / weeklyQuizzes.length 
      : 0;

    const totalStudyTime = await this.prisma.lessonProgress.aggregate({
      where: {
        userId: studentId,
        lastAccessed: {
          gte: weekStart,
          lte: weekEnd
        }
      },
      _sum: {
        timeSpent: true
      }
    });

    // Zayıf ve güçlü konuları analiz et
    const subjectScores = new Map();
    weeklyQuizzes.forEach(quiz => {
      // Quiz'in konusunu almak için quiz detayını çek
      // Bu basitleştirilmiş versiyonda quiz.answers'dan konu bilgisini çıkarıyoruz
      if (quiz.answers && typeof quiz.answers === 'object') {
        const answers = quiz.answers as any;
        if (answers.subject) {
          const subject = answers.subject;
          if (!subjectScores.has(subject)) {
            subjectScores.set(subject, []);
          }
          subjectScores.get(subject).push(quiz.score);
        }
      }
    });

    const weakSubjects: string[] = [];
    const strongSubjects: string[] = [];
    
    for (const [subject, scores] of subjectScores.entries()) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avgScore < 70) {
        weakSubjects.push(subject);
      } else if (avgScore >= 85) {
        strongSubjects.push(subject);
      }
    }

    // Son başarıları getir
    const recentAchievements = await this.prisma.userAchievement.findMany({
      where: {
        userId: studentId,
        unlockedAt: {
          gte: weekStart,
          lte: weekEnd
        }
      },
      include: {
        achievement: true
      }
    });

    const summaryData = {
      studentId,
      parentId,
      weeklyLessons,
      weeklyQuizzes: weeklyQuizzes.length,
      averageScore,
      totalStudyTime: Math.round((totalStudyTime._sum.timeSpent || 0) / 60), // dakika
      weakSubjects,
      strongSubjects,
      achievements: recentAchievements.map(ua => ({
        title: ua.achievement.title,
        category: ua.achievement.category,
        points: ua.achievement.points,
        unlockedAt: ua.unlockedAt
      })),
      weekStartDate: weekStart,
      weekEndDate: weekEnd
    };

    if (summary) {
      // Mevcut özeti güncelle
      summary = await this.prisma.studentProgressSummary.update({
        where: { id: summary.id },
        data: summaryData
      });
    } else {
      // Yeni özet oluştur
      summary = await this.prisma.studentProgressSummary.create({
        data: summaryData
      });
    }

    return summary;
  }

  // Haftalık ilerleme özeti oluştur (yeni versiyon)
  async createWeeklyProgressSummary(parentId: string, studentId: string) {
    // Verify parent-student connection
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        parentId,
        studentId,
        connectionStatus: 'approved',
      },
    });

    if (!connection) {
      throw new ForbiddenException('No approved connection found with this student');
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get lesson progress for the week
    const lessonProgress = await this.prisma.lessonProgress.findMany({
      where: {
        userId: studentId,
        lastAccessed: {
          gte: oneWeekAgo,
        },
      },
      include: {
        lesson: true,
      },
    });

    // Get quiz attempts for the week
    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where: {
        userId: studentId,
        attemptDate: {
          gte: oneWeekAgo,
        },
      },
      include: {
        quiz: true,
      },
    });

    const summary = {
      weekStart: oneWeekAgo,
      weekEnd: new Date(),
      lessonsCompleted: lessonProgress.filter(lp => lp.completed).length,
      totalLessons: lessonProgress.length,
      quizzesCompleted: quizAttempts.length,
      averageQuizScore: quizAttempts.length > 0 
        ? quizAttempts.reduce((sum, qa) => sum + qa.score, 0) / quizAttempts.length 
        : 0,
      totalStudyTime: lessonProgress.reduce((sum, lp) => sum + (lp.timeSpent || 0), 0),
      subjects: [...new Set([
        ...lessonProgress.map(lp => lp.lesson.subject),
        ...quizAttempts.map(qa => qa.quiz.subject)
      ])],
    };

    // Create or update weekly summary
    return this.prisma.studentProgressSummary.upsert({
      where: {
        studentId_parentId_weekStartDate: {
          studentId,
          parentId,
          weekStartDate: oneWeekAgo,
        },
      },
      update: {
        weeklyLessons: summary.lessonsCompleted,
        weeklyQuizzes: summary.quizzesCompleted,
        averageScore: summary.averageQuizScore,
        totalStudyTime: Math.round(summary.totalStudyTime / 60),
      },
      create: {
        studentId,
        parentId,
        weekStartDate: oneWeekAgo,
        weekEndDate: summary.weekEnd,
        weeklyLessons: summary.lessonsCompleted,
        weeklyQuizzes: summary.quizzesCompleted,
        averageScore: summary.averageQuizScore,
        totalStudyTime: Math.round(summary.totalStudyTime / 60),
        weakSubjects: [],
        strongSubjects: [],
        achievements: [],
      },
    });
  }

  // Öğrenci analitik verilerini getir
  async getStudentAnalytics(parentId: string, studentId: string) {
    // Verify parent-student connection
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        parentId,
        studentId,
        connectionStatus: 'approved',
      },
    });

    if (!connection) {
      throw new ForbiddenException('No approved connection found with this student');
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get comprehensive analytics data
    const [lessonProgress, quizAttempts, achievements, student] = await Promise.all([
      this.prisma.lessonProgress.findMany({
        where: { userId: studentId },
        include: { lesson: true },
        orderBy: { lastAccessed: 'desc' },
      }),
      this.prisma.quizAttempt.findMany({
        where: { userId: studentId },
        include: { quiz: true },
        orderBy: { attemptDate: 'desc' },
      }),
      this.prisma.userAchievement.findMany({
        where: { userId: studentId },
        include: { achievement: true },
        orderBy: { unlockedAt: 'desc' },
      }),
      this.prisma.user.findUnique({
        where: { id: studentId },
        include: { profile: true },
      }),
    ]);

    // Calculate overview statistics
    const totalStudyHours = lessonProgress.reduce((sum, lp) => sum + (lp.timeSpent || 0), 0) / 3600;
    const totalLessonsCompleted = lessonProgress.filter(lp => lp.completed).length;
    const totalQuizzesCompleted = quizAttempts.length;
    const averageScore = quizAttempts.length > 0 
      ? quizAttempts.reduce((sum, qa) => sum + qa.score, 0) / quizAttempts.length 
      : 0;

    // Calculate weekly progress for last 8 weeks
    const weeklyProgress: WeeklyProgress[] = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (i * 7));

      const weekLessons = lessonProgress.filter(lp => 
        lp.lastAccessed >= weekStart && lp.lastAccessed < weekEnd && lp.completed
      );
      const weekQuizzes = quizAttempts.filter(qa => 
        qa.attemptDate >= weekStart && qa.attemptDate < weekEnd
      );

      weeklyProgress.push({
        week: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        lessonsCompleted: weekLessons.length,
        quizzesCompleted: weekQuizzes.length,
        studyHours: Math.round(weekLessons.reduce((sum, lp) => sum + (lp.timeSpent || 0), 0) / 3600),
        averageScore: weekQuizzes.length > 0 
          ? Math.round(weekQuizzes.reduce((sum, qa) => sum + qa.score, 0) / weekQuizzes.length)
          : 0,
      });
    }

    // Calculate subject performance
    const subjectStats: Record<string, any> = {};
    quizAttempts.forEach(qa => {
      const subject = qa.quiz.subject;
      if (!subjectStats[subject]) {
        subjectStats[subject] = {
          totalQuestions: 0,
          correctAnswers: 0,
          totalTime: 0,
          attempts: 0,
          scores: [],
        };
      }
      const questionCount = Array.isArray(qa.quiz.questions) ? qa.quiz.questions.length : 10;
      subjectStats[subject].totalQuestions += questionCount;
      subjectStats[subject].correctAnswers += Math.round((qa.score / 100) * questionCount);
      subjectStats[subject].totalTime += qa.timeTaken || 0;
      subjectStats[subject].attempts += 1;
      subjectStats[subject].scores.push(qa.score);
    });

    const subjectPerformance = Object.entries(subjectStats).map(([subject, stats]: [string, any]) => {
      const accuracy = stats.totalQuestions > 0 
        ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
        : 0;
      const averageTime = stats.attempts > 0 
        ? Math.round(stats.totalTime / stats.attempts)
        : 0;
      
      // Calculate improvement (compare first half vs second half of attempts)
      const halfPoint = Math.floor(stats.scores.length / 2);
      const firstHalf = stats.scores.slice(0, halfPoint);
      const secondHalf = stats.scores.slice(halfPoint);
      const improvement = firstHalf.length > 0 && secondHalf.length > 0
        ? Math.round((secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length) - 
                    (firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length))
        : 0;

      return {
        subject,
        totalQuestions: stats.totalQuestions,
        correctAnswers: stats.correctAnswers,
        accuracy,
        averageTime,
        improvement,
      };
    });

    // Calculate time distribution
    const timeStats: Record<string, number> = {};
    lessonProgress.forEach(lp => {
      const subject = lp.lesson.subject;
      timeStats[subject] = (timeStats[subject] || 0) + (lp.timeSpent || 0);
    });

    const totalTime = Object.values(timeStats).reduce((sum: number, time: number) => sum + time, 0);
    const timeDistribution = Object.entries(timeStats).map(([subject, seconds]: [string, number]) => ({
      subject,
      hours: Math.round(seconds / 3600),
      percentage: totalTime > 0 ? Math.round((seconds / totalTime) * 100) : 0,
    }));

    // Get recent activities
    const recentActivities = [
      ...lessonProgress.slice(0, 10).map(lp => ({
        id: lp.id,
        type: 'lesson' as const,
        title: lp.lesson.title,
        subject: lp.lesson.subject,
        duration: lp.timeSpent || 0,
        completedAt: lp.lastAccessed.toISOString(),
      })),
      ...quizAttempts.slice(0, 10).map(qa => ({
        id: qa.id,
        type: 'quiz' as const,
        title: qa.quiz.title,
        subject: qa.quiz.subject,
        score: qa.score,
        duration: qa.timeTaken || 0,
        completedAt: qa.attemptDate.toISOString(),
      })),
    ].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).slice(0, 15);

    // Get achievements
    const achievementsList = achievements.map(ua => ({
      id: ua.achievement.id,
      title: ua.achievement.title,
      description: ua.achievement.description,
      unlockedAt: ua.unlockedAt.toISOString(),
      category: ua.achievement.category,
    }));

    // Identify weak areas
    const weakAreas = subjectPerformance
      .filter(sp => sp.accuracy < 70)
      .map(sp => ({
        subject: sp.subject,
        topic: sp.subject,
        accuracy: sp.accuracy,
        attempts: Math.floor(sp.totalQuestions / 10),
        lastAttempt: quizAttempts.find(qa => qa.quiz.subject === sp.subject)?.attemptDate.toISOString() || new Date().toISOString(),
      }));

    // Generate recommendations
    const recommendations: Recommendation[] = [];
    if (averageScore < 70) {
      recommendations.push({
        type: 'practice' as const,
        title: 'Daha Fazla Pratik Yapın',
        description: 'Genel performansı artırmak için günlük pratik yapmanızı öneririz.',
        priority: 'high' as const,
        estimatedTime: 30,
      });
    }
    if (weakAreas.length > 0) {
      recommendations.push({
        type: 'review' as const,
        title: `${weakAreas[0].subject} Konusunu Tekrar Edin`,
        description: `${weakAreas[0].subject} konusunda zorlanıyorsunuz. Bu konuyu tekrar etmenizi öneririz.`,
        priority: 'high' as const,
        estimatedTime: 45,
      });
    }
    if (totalStudyHours < 10) {
      recommendations.push({
        type: 'study_plan' as const,
        title: 'Çalışma Saatlerini Artırın',
        description: 'Daha iyi sonuçlar için haftalık çalışma saatlerinizi artırmanızı öneririz.',
        priority: 'medium' as const,
        estimatedTime: 60,
      });
    }

    return {
      overview: {
        totalStudyHours: Math.round(totalStudyHours),
        totalLessonsCompleted,
        totalQuizzesCompleted,
        averageScore: Math.round(averageScore),
        currentStreak: 5,
        longestStreak: 12,
      },
      weeklyProgress,
      subjectPerformance,
      timeDistribution,
      recentActivities,
      achievements: achievementsList,
      weakAreas,
      recommendations,
    };
  }

  // Öğrenciye mesaj gönder
  async sendMessageToStudent(parentId: string, studentId: string, message: string, type: string) {
    // Verify parent-student connection
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        parentId,
        studentId,
        connectionStatus: 'approved',
      },
    });

    if (!connection) {
      throw new ForbiddenException('No approved connection found with this student');
    }

    return this.prisma.notification.create({
      data: {
        senderId: parentId,
        receiverId: studentId,
        title: `Veli Mesajı - ${type === 'encouragement' ? 'Teşvik' : type === 'suggestion' ? 'Öneri' : 'Hatırlatma'}`,
        message,
        type: 'parent_message',
      },
    });
  }

  // Dashboard özeti getir
  async getDashboardSummary(parentId: string) {
    const connections = await this.prisma.parentStudentConnection.findMany({
      where: {
        parentId,
        connectionStatus: 'approved',
      },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
      },
    });

    const summaries = await Promise.all(
      connections.map(async (connection) => {
        const studentId = connection.studentId;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const [lessonProgress, quizAttempts] = await Promise.all([
          this.prisma.lessonProgress.findMany({
            where: {
              userId: studentId,
              lastAccessed: { gte: oneWeekAgo },
              completed: true,
            },
          }),
          this.prisma.quizAttempt.findMany({
            where: {
              userId: studentId,
              attemptDate: { gte: oneWeekAgo },
            },
          }),
        ]);

        const averageScore = quizAttempts.length > 0
          ? quizAttempts.reduce((sum, qa) => sum + qa.score, 0) / quizAttempts.length
          : 0;

        return {
          student: {
            id: connection.student.id,
            firstName: connection.student.firstName,
            lastName: connection.student.lastName,
            email: connection.student.email,
          },
          weeklyStats: {
            lessonsCompleted: lessonProgress.length,
            quizzesCompleted: quizAttempts.length,
            averageScore: Math.round(averageScore),
            studyHours: Math.round(lessonProgress.reduce((sum, lp) => sum + (lp.timeSpent || 0), 0) / 3600),
          },
        };
      })
    );

    return {
      connectedStudents: summaries.length,
      totalWeeklyLessons: summaries.reduce((sum, s) => sum + s.weeklyStats.lessonsCompleted, 0),
      totalWeeklyQuizzes: summaries.reduce((sum, s) => sum + s.weeklyStats.quizzesCompleted, 0),
      averagePerformance: summaries.length > 0
        ? Math.round(summaries.reduce((sum, s) => sum + s.weeklyStats.averageScore, 0) / summaries.length)
        : 0,
      students: summaries,
    };
  }

  // Öğrenci programını getir
  async getStudentSchedule(parentId: string, studentId: string) {
    // Verify parent-student connection
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        parentId,
        studentId,
        connectionStatus: 'approved',
      },
    });

    if (!connection) {
      throw new ForbiddenException('No approved connection found with this student');
    }

    // Get user profile for study preferences
    const student = await this.prisma.user.findUnique({
      where: { id: studentId },
      include: { profile: true },
    });

    // Get upcoming lessons and quizzes
    const [lessons, quizzes] = await Promise.all([
      this.prisma.lesson.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quiz.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      studyPreferences: {
        preferredStudyHours: student?.profile?.studyHours || 2,
        learningStyle: student?.profile?.learningStyle || 'visual',
        difficultyPreference: student?.profile?.difficultyPreference || 'medium',
      },
      upcomingLessons: lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        subject: lesson.subject,
        difficulty: lesson.difficulty,
        estimatedDuration: lesson.duration,
      })),
      recommendedQuizzes: quizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        difficulty: quiz.difficulty,
        questionCount: Array.isArray(quiz.questions) ? quiz.questions.length : 10,
      })),
    };
  }

  // Çalışma hedefleri belirle
  async setStudyGoals(parentId: string, studentId: string, goals: any[]) {
    // Verify parent-student connection
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        parentId,
        studentId,
        connectionStatus: 'approved',
      },
    });

    if (!connection) {
      throw new ForbiddenException('No approved connection found with this student');
    }

    // Update user profile with new goals
    return this.prisma.userProfile.upsert({
      where: { userId: studentId },
      update: {
        goals: goals as any,
      },
      create: {
        userId: studentId,
        goals: goals as any,
        learningStyle: 'VISUAL',
        interests: [],
        studyHours: 2,
        difficultyPreference: 'medium',
        personalizedContent: {},
      },
    });
  }
}
