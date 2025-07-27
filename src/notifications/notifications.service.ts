import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './notifications.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(data: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        receiverId: data.userId,
        senderId: null, // System notifications don't have a sender
        isRead: false,
        createdAt: new Date(),
      },
    });
  }

  async getUserNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { receiverId: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({
        where: { receiverId: userId },
      }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        receiverId: userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async deleteNotification(notificationId: string, userId: string) {
    return this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        receiverId: userId,
      },
    });
  }

  // Helper methods for creating specific notification types
  async notifyQuizCompleted(userId: string, quizTitle: string, score: number) {
    return this.createNotification({
      title: 'Quiz Tamamlandı',
      message: `"${quizTitle}" quizini tamamladınız. Skorunuz: ${score}%`,
      type: 'QUIZ_COMPLETED',
      userId,
    });
  }

  async notifyLessonCompleted(userId: string, lessonTitle: string) {
    return this.createNotification({
      title: 'Ders Tamamlandı',
      message: `"${lessonTitle}" dersini başarıyla tamamladınız!`,
      type: 'LESSON_COMPLETED',
      userId,
    });
  }

  async notifyAchievementUnlocked(userId: string, achievementTitle: string) {
    try {
      console.log('Creating achievement notification for user:', userId, 'achievement:', achievementTitle);
      const result = await this.createNotification({
        title: 'Yeni Başarı!',
        message: `"${achievementTitle}" başarısını kazandınız!`,
        type: 'ACHIEVEMENT_UNLOCKED',
        userId,
      });
      console.log('Achievement notification created successfully');
      return result;
    } catch (error) {
      console.error('Error creating achievement notification:', error);
      throw error;
    }
  }

  async notifyParentConnection(userId: string, parentName: string) {
    return this.createNotification({
      title: 'Ebeveyn Bağlantısı',
      message: `${parentName} sizinle bağlantı kurdu.`,
      type: 'PARENT_CONNECTION',
      userId,
    });
  }

  async notifyNewMessage(userId: string, senderName: string) {
    return this.createNotification({
      title: 'Yeni Mesaj',
      message: `${senderName} size bir mesaj gönderdi.`,
      type: 'NEW_MESSAGE',
      userId,
    });
  }
}