import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import {
  UpdateUserProfileDto,
  OnboardingQuizDto,
  SubmitOnboardingQuizDto,
  PersonalizedHomepageDto,
} from './user-onboarding.dto';
import { OnboardingStatus, User, UserProfile, AssessmentResult } from '@prisma/client';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage } from '@langchain/core/messages';



@Injectable()
export class UserOnboardingService {
  private llm: ChatGoogleGenerativeAI;

  constructor(
    private readonly prisma: PrismaService,
  ) {
    const apiKey = process.env.GOOGLE_API_KEY;
    
    // Only initialize LLM if API key is available and not in test environment
    if (apiKey && process.env.NODE_ENV !== 'test') {
      this.llm = new ChatGoogleGenerativeAI({
        model: 'gemini-2.0-flash-exp',
        temperature: 0.7,
        apiKey: apiKey,
      });
    } else {
      console.warn('Google API Key is not configured or in test environment. Using mock responses.');
    }
  }

  private cleanJsonResponse(content: string): string {
    // Remove markdown code blocks
    content = content.replace(/```json\s*|```\s*/g, '').trim();
    
    // Remove any text before the first { or [
    const jsonStart = Math.min(
      content.indexOf('{') !== -1 ? content.indexOf('{') : Infinity,
      content.indexOf('[') !== -1 ? content.indexOf('[') : Infinity
    );
    
    if (jsonStart !== Infinity) {
      content = content.substring(jsonStart);
    }
    
    // Remove any text after the last } or ]
    const lastBrace = content.lastIndexOf('}');
    const lastBracket = content.lastIndexOf(']');
    const jsonEnd = Math.max(lastBrace, lastBracket);
    
    if (jsonEnd !== -1) {
      content = content.substring(0, jsonEnd + 1);
    }
    
    return content.trim();
  }

  async updateUserProfile(userId: string, updateData: UpdateUserProfileDto) {
    try {
      // Update user basic info
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          age: updateData.age,
          gender: updateData.gender,
          gradeLevel: updateData.gradeLevel,
          weakSubjects: updateData.weakSubjects || [],
          onboardingStatus: OnboardingStatus.IN_PROGRESS,
        },
      });

      // Create or update user profile
      const profileData = {
        learningStyle: updateData.learningStyle,
        interests: updateData.interests || [],
        goals: updateData.goals || [],
        studyHours: updateData.studyHours,
        difficultyPreference: updateData.difficultyPreference,
      };

      const userProfile = await this.prisma.userProfile.upsert({
        where: { userId },
        update: profileData,
        create: {
          userId,
          ...profileData,
        },
      });

      return {
        user: updatedUser,
        profile: userProfile,
      };
    } catch (error) {
      throw new BadRequestException('Failed to update user profile');
    }
  }

  async getUserProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        ...user,
        onboardingStatus: user.onboardingStatus,
      };
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async generateOnboardingQuiz(userId: string, quizData: OnboardingQuizDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const result = await this.createQuizWorkflow(quizData.subjects, quizData.questionsPerSubject || 5);
      return result;
    } catch (error) {
      console.error('Error generating onboarding quiz:', error);
      // Fallback quiz generation
      return this.generateFallbackQuiz(quizData.subjects, quizData.questionsPerSubject || 5);
    }
  }

  async submitOnboardingQuiz(userId: string, quizAnswers: SubmitOnboardingQuizDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Analyze quiz results
      const analysis = await this.createQuizAnalysisWorkflow(quizAnswers.answers);

      // Save assessment results
      const assessmentPromises = quizAnswers.answers.map(async (answer) => {
        return this.prisma.assessmentResult.create({
          data: {
            userId,
            subject: answer.subject,
            score: analysis.subjectScores?.[answer.subject] || 0,
            totalQuestions: 1,
            correctAnswers: analysis.correctAnswers?.[answer.questionId] ? 1 : 0,
            weakAreas: analysis.weakAreas || [],
            recommendations: analysis.recommendations || {},
            assessmentType: 'onboarding',
          },
        });
      });

      await Promise.all(assessmentPromises);

      // Update user weak subjects and complete onboarding
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          weakSubjects: analysis.weakSubjects || [],
          onboardingStatus: OnboardingStatus.COMPLETED,
        },
      });

      return {
        analysis,
        weakSubjects: analysis.weakSubjects || [],
        recommendations: analysis.recommendations || {},
      };
    } catch (error) {
      console.error('Error submitting onboarding quiz:', error);
      throw new BadRequestException('Failed to submit quiz answers');
    }
  }

  async generatePersonalizedHomepage(userId: string, options: PersonalizedHomepageDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          lessonsCompleted: {
            include: { lesson: true },
            orderBy: { lastAccessed: 'desc' },
            take: 10,
          },
          quizzesTaken: {
            include: { quiz: true },
            orderBy: { attemptDate: 'desc' },
            take: 5,
          },
          assessmentResults: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const result = await this.createPersonalizedHomepageWorkflow(user);
      
      // Get actual lessons and quizzes based on recommendations
      const recommendedLessons = await this.getRecommendedLessons(user, options.lessonCount || 5);
      const recommendedQuizzes = options.includeQuizzes 
        ? await this.getRecommendedQuizzes(user, 5) 
        : [];

      return {
        personalizedContent: result,
        recommendedLessons,
        recommendedQuizzes,
        progressAnalytics: options.includeProgress 
          ? await this.getProgressAnalytics(userId) 
          : null,
        weakSubjectsAnalysis: {
          subjects: user.weakSubjects,
          recommendations: result?.weakSubjectRecommendations || {},
        },
      };
    } catch (error) {
      console.error('Error generating personalized homepage:', error);
      return this.generateFallbackHomepage(userId, options);
    }
  }

  private async createQuizWorkflow(subjects: string[], questionsPerSubject: number) {
    try {
      // Use mock data in test environment or when LLM is not available
      if (!this.llm || process.env.NODE_ENV === 'test') {
        return this.generateFallbackQuiz(subjects, questionsPerSubject);
      }

      const prompt = `
        Create an educational quiz with the following requirements:
        - Subjects: ${subjects.join(', ')}
        - ${questionsPerSubject} questions per subject
        - Each question should have 4 multiple choice options
        - Include the correct answer
        - Questions should assess understanding level
        
        Return the quiz in JSON format with this structure:
        {
          "questions": [
            {
              "subject": "subject_name",
              "question": "question_text",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": "A",
              "difficulty": "easy|medium|hard"
            }
          ]
        }
      `;

      const response = await this.llm.invoke([new HumanMessage(prompt)]);
      const content = this.cleanJsonResponse(response.content as string);
      const quizData = JSON.parse(content);
      
      return quizData;
    } catch (error) {
      console.error('Error in quiz generation workflow:', error);
      return this.generateFallbackQuiz(subjects, questionsPerSubject);
    }
  }

  private async createQuizAnalysisWorkflow(answers: any[]) {
    try {
      // Use mock data in test environment or when LLM is not available
      if (!this.llm || process.env.NODE_ENV === 'test') {
        return {
          weakSubjects: [],
          recommendations: {},
          subjectScores: {},
          weakAreas: []
        };
      }

      const prompt = `
        Analyze the following quiz answers and provide:
        1. Subject scores (0-100)
        2. Identified weak subjects
        3. Specific weak areas
        4. Personalized recommendations
        
        Quiz answers: ${JSON.stringify(answers, null, 2)}
        
        Return as JSON format:
        {
          "weakSubjects": ["subject1", "subject2"],
          "subjectScores": {"subject1": 60, "subject2": 75},
          "weakAreas": ["area1", "area2"],
          "recommendations": {"subject1": "recommendation1"}
        }
      `;

      const response = await this.llm.invoke([new HumanMessage(prompt)]);
      const content = this.cleanJsonResponse(response.content as string);
      const analysis = JSON.parse(content);
      
      return analysis;
    } catch (error) {
      console.error('Error in quiz analysis workflow:', error);
      return {
        weakSubjects: [],
        recommendations: {},
        subjectScores: {},
        weakAreas: []
      };
    }
  }

  private async createPersonalizedHomepageWorkflow(user: any) {
    try {
      // Use mock data in test environment or when LLM is not available
      if (!this.llm || process.env.NODE_ENV === 'test') {
        return {
          priorityAreas: user.weakSubjects || [],
          studyPlan: {},
          motivation: 'Keep learning and growing!',
          weakSubjectRecommendations: {}
        };
      }

      const prompt = `
        Generate personalized homepage content for a user with the following profile:
        - Weak subjects: ${user.weakSubjects?.join(', ') || 'None'}
        - Grade level: ${user.gradeLevel || 'Not specified'}
        - Learning style: ${user.profile?.learningStyle || 'Not specified'}
        - Interests: ${user.profile?.interests?.join(', ') || 'None'}
        
        Generate content including:
        1. Priority learning areas
        2. Recommended study plan
        3. Motivational content
        4. Weak subject improvement strategies
        
        Return as JSON format:
        {
          "priorityAreas": ["area1", "area2"],
          "studyPlan": {"daily": "plan", "weekly": "plan"},
          "motivation": "motivational message",
          "weakSubjectRecommendations": {"subject1": "strategy1"}
        }
      `;

      const response = await this.llm.invoke([new HumanMessage(prompt)]);
      const content = this.cleanJsonResponse(response.content as string);
      const recommendations = JSON.parse(content);
      
      return recommendations;
    } catch (error) {
      console.error('Error in personalized homepage workflow:', error);
      return {
        priorityAreas: user.weakSubjects || [],
        studyPlan: {},
        motivation: 'Keep learning and growing!',
        weakSubjectRecommendations: {}
      };
    }
  }

  private async getRecommendedLessons(user: any, count: number) {
    const completedLessonIds = user.lessonsCompleted.map(lc => lc.lessonId);
    
    return this.prisma.lesson.findMany({
      where: {
        AND: [
          { id: { notIn: completedLessonIds } },
          {
            OR: [
              { subject: { in: user.weakSubjects } },
              { tags: { hasSome: user.profile?.interests || [] } },
            ],
          },
        ],
      },
      orderBy: [
        { difficulty: 'asc' },
        { createdAt: 'desc' },
      ],
      take: count,
    });
  }

  private async getRecommendedQuizzes(user: any, count: number) {
    const takenQuizIds = user.quizzesTaken.map(qt => qt.quizId);
    
    return this.prisma.quiz.findMany({
      where: {
        AND: [
          { id: { notIn: takenQuizIds } },
          { subject: { in: user.weakSubjects } },
        ],
      },
      orderBy: [
        { difficulty: 'asc' },
        { createdAt: 'desc' },
      ],
      take: count,
    });
  }

  private async getProgressAnalytics(userId: string) {
    const [totalLessons, completedLessons, totalQuizzes, takenQuizzes, avgScore] = await Promise.all([
      this.prisma.lesson.count(),
      this.prisma.lessonProgress.count({ where: { userId, completed: true } }),
      this.prisma.quiz.count(),
      this.prisma.quizAttempt.count({ where: { userId } }),
      this.prisma.quizAttempt.aggregate({
        where: { userId },
        _avg: { score: true },
      }),
    ]);

    return {
      lessonsProgress: {
        completed: completedLessons,
        total: totalLessons,
        percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      },
      quizzesProgress: {
        taken: takenQuizzes,
        total: totalQuizzes,
        averageScore: Math.round(avgScore._avg.score || 0),
      },
    };
  }

  private generateFallbackQuiz(subjects: string[], questionsPerSubject: number) {
    const fallbackQuestions = subjects.flatMap(subject => 
      Array.from({ length: questionsPerSubject }, (_, i) => ({
        id: `${subject}_q${i + 1}`,
        subject,
        question: `Sample question ${i + 1} for ${subject}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        type: 'multiple_choice',
      }))
    );

    return {
      questions: fallbackQuestions,
      subjects,
      totalQuestions: fallbackQuestions.length,
    };
  }

  private async generateFallbackHomepage(userId: string, options: PersonalizedHomepageDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    return {
      personalizedContent: {
        message: 'Welcome to your personalized learning dashboard!',
        priorityAreas: user?.weakSubjects || [],
        studyPlan: 'Focus on your weak subjects and practice regularly.',
      },
      recommendedLessons: await this.getRecommendedLessons(user, options.lessonCount || 5),
      recommendedQuizzes: [],
      progressAnalytics: options.includeProgress 
        ? await this.getProgressAnalytics(userId) 
        : null,
      weakSubjectsAnalysis: {
        subjects: user?.weakSubjects || [],
        recommendations: {},
      },
    };
  }

  // Parent-Student Connection Methods
  async getParentRequests(studentId: string) {
    return this.prisma.parentStudentConnection.findMany({
      where: {
        studentId,
        connectionStatus: 'pending',
      },
      include: {
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async approveParentRequest(studentId: string, connectionId: string) {
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        id: connectionId,
        studentId,
        connectionStatus: 'pending',
      },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    const updatedConnection = await this.prisma.parentStudentConnection.update({
      where: { id: connectionId },
      data: {
        connectionStatus: 'approved',
        approvedAt: new Date(),
      },
      include: {
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create notification for parent
    await this.prisma.notification.create({
      data: {
        senderId: studentId,
        receiverId: connection.parentId,
        type: 'CONNECTION_APPROVED',
        title: 'Bağlantı İsteği Onaylandı',
        message: 'Öğrenci bağlantı isteğinizi onayladı.',
      },
    });

    return updatedConnection;
  }

  async rejectParentRequest(studentId: string, connectionId: string) {
    const connection = await this.prisma.parentStudentConnection.findFirst({
      where: {
        id: connectionId,
        studentId,
        connectionStatus: 'pending',
      },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found');
    }

    await this.prisma.parentStudentConnection.update({
      where: { id: connectionId },
      data: {
        connectionStatus: 'rejected',
      },
    });

    // Create notification for parent
    await this.prisma.notification.create({
      data: {
        senderId: studentId,
        receiverId: connection.parentId,
        type: 'CONNECTION_REJECTED',
        title: 'Bağlantı İsteği Reddedildi',
        message: 'Öğrenci bağlantı isteğinizi reddetti.',
      },
    });

    return { message: 'Connection request rejected successfully' };
  }

  async getConnectedParents(studentId: string) {
    return this.prisma.parentStudentConnection.findMany({
      where: {
        studentId,
        connectionStatus: 'approved',
      },
      include: {
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { approvedAt: 'desc' },
    });
  }
}