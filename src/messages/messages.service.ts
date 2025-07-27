import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateMessageDto, GetMessagesDto } from './messages.dto';
import { MessageType, UserRole } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async sendMessage(senderId: string, data: CreateMessageDto) {
    // Verify sender and receiver exist
    const [sender, receiver] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: senderId } }),
      this.prisma.user.findUnique({ where: { id: data.receiverId } }),
    ]);

    if (!sender || !receiver) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Check if users can message each other
    await this.validateMessagePermission(senderId, data.receiverId);

    const message = await this.prisma.message.create({
      data: {
        content: data.content,
        senderId,
        receiverId: data.receiverId,
        createdAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },

      },
    });

    // Send notification to receiver
    await this.notificationsService.notifyNewMessage(
      data.receiverId,
      `${sender.firstName} ${sender.lastName}`,
    );

    return message;
  }

  async getConversation(
    userId: string,
    otherUserId: string,
    query: GetMessagesDto,
  ) {
    // Verify permission to view conversation
    await this.validateMessagePermission(userId, otherUserId);

    const skip = ((query.page || 1) - 1) * (query.limit || 10);

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: query.limit,
      }),
      this.prisma.message.count({
        where: {
          OR: [
            { senderId: userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: userId },
          ],
        },
      }),
    ]);

    // Mark messages as read
    await this.markMessagesAsRead(userId, otherUserId);

    return {
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / (query.limit || 10)),
      },
    };
  }

  async getUserConversations(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Get latest message for each conversation
    const conversations = await this.prisma.$queryRaw`
      SELECT DISTINCT
        CASE 
          WHEN m.senderId = ${userId} THEN m.receiverId
          ELSE m.senderId
        END as otherUserId,
        CONCAT(u.firstName, ' ', u.lastName) as otherUserName,
        u.role as otherUserRole,
        latest.content as lastMessage,
        latest.createdAt as lastMessageAt,
        latest.senderId as lastMessageSenderId,
        COALESCE(unread.unreadCount, 0) as unreadCount
      FROM Message m
      INNER JOIN User u ON (
        (m.senderId = ${userId} AND u.id = m.receiverId) OR
        (m.receiverId = ${userId} AND u.id = m.senderId)
      )
      INNER JOIN (
        SELECT 
          CASE 
            WHEN senderId = ${userId} THEN receiverId
            ELSE senderId
          END as otherUserId,
          content,
          createdAt,
          senderId,
          ROW_NUMBER() OVER (
            PARTITION BY CASE 
              WHEN senderId = ${userId} THEN receiverId
              ELSE senderId
            END 
            ORDER BY createdAt DESC
          ) as rn
        FROM Message
        WHERE senderId = ${userId} OR receiverId = ${userId}
      ) latest ON latest.otherUserId = u.id AND latest.rn = 1
      LEFT JOIN (
        SELECT 
          senderId as otherUserId,
          COUNT(*) as unreadCount
        FROM Message
        WHERE receiverId = ${userId} AND readAt IS NULL
        GROUP BY senderId
      ) unread ON unread.otherUserId = u.id
      ORDER BY latest.createdAt DESC
      LIMIT ${limit} OFFSET ${skip}
    `;

    return {
      conversations,
      pagination: {
        page,
        limit,
      },
    };
  }

  async markMessagesAsRead(userId: string, senderId: string) {
    return this.prisma.message.updateMany({
      where: {
        receiverId: userId,
        senderId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  async getUnreadMessageCount(userId: string) {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        readAt: null,
      },
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Mesaj bulunamadı');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('Bu mesajı silme yetkiniz yok');
    }

    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }

  private async validateMessagePermission(userId1: string, userId2: string) {
    const [user1, user2] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId1 } }),
      this.prisma.user.findUnique({ where: { id: userId2 } }),
    ]);

    if (!user1 || !user2) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Admin can message anyone
    if (user1.role === UserRole.ADMIN || user2.role === UserRole.ADMIN) {
      return true;
    }

    // Teacher can message students and parents
    if (user1.role === UserRole.TEACHER && 
        (user2.role === UserRole.STUDENT || user2.role === UserRole.PARENT)) {
      return true;
    }

    if (user2.role === UserRole.TEACHER && 
        (user1.role === UserRole.STUDENT || user1.role === UserRole.PARENT)) {
      return true;
    }

    // Parent can message their connected students
    if (user1.role === UserRole.PARENT && user2.role === UserRole.STUDENT) {
      const connection = await this.prisma.parentStudentConnection.findFirst({
        where: {
          parentId: userId1,
          studentId: userId2,
          connectionStatus: 'approved',
        },
      });
      if (connection) return true;
    }

    if (user2.role === UserRole.PARENT && user1.role === UserRole.STUDENT) {
      const connection = await this.prisma.parentStudentConnection.findFirst({
        where: {
          parentId: userId2,
          studentId: userId1,
          connectionStatus: 'approved',
        },
      });
      if (connection) return true;
    }

    throw new ForbiddenException('Bu kullanıcıyla mesajlaşma yetkiniz yok');
  }
}