"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOnboardingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const google_genai_1 = require("@langchain/google-genai");
const messages_1 = require("@langchain/core/messages");
let UserOnboardingService = class UserOnboardingService {
    prisma;
    llm;
    constructor(prisma) {
        this.prisma = prisma;
        const apiKey = process.env.GOOGLE_API_KEY;
        if (apiKey && process.env.NODE_ENV !== 'test') {
            this.llm = new google_genai_1.ChatGoogleGenerativeAI({
                model: 'gemini-2.0-flash-exp',
                temperature: 0.7,
                apiKey: apiKey,
            });
        }
        else {
            console.warn('Google API Key is not configured or in test environment. Using mock responses.');
        }
    }
    cleanJsonResponse(content) {
        content = content.replace(/```json\s*|```\s*/g, '').trim();
        const jsonStart = Math.min(content.indexOf('{') !== -1 ? content.indexOf('{') : Infinity, content.indexOf('[') !== -1 ? content.indexOf('[') : Infinity);
        if (jsonStart !== Infinity) {
            content = content.substring(jsonStart);
        }
        const lastBrace = content.lastIndexOf('}');
        const lastBracket = content.lastIndexOf(']');
        const jsonEnd = Math.max(lastBrace, lastBracket);
        if (jsonEnd !== -1) {
            content = content.substring(0, jsonEnd + 1);
        }
        return content.trim();
    }
    async updateUserProfile(userId, updateData) {
        try {
            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    age: updateData.age,
                    gender: updateData.gender,
                    gradeLevel: updateData.gradeLevel,
                    weakSubjects: updateData.weakSubjects || [],
                    onboardingStatus: client_1.OnboardingStatus.IN_PROGRESS,
                },
            });
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
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update user profile');
        }
    }
    async getUserProfile(userId) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return {
                ...user,
                onboardingStatus: user.onboardingStatus,
            };
        }
        catch (error) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async generateOnboardingQuiz(userId, quizData) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const result = await this.createQuizWorkflow(quizData.subjects, quizData.questionsPerSubject || 5);
            return result;
        }
        catch (error) {
            console.error('Error generating onboarding quiz:', error);
            return this.generateFallbackQuiz(quizData.subjects, quizData.questionsPerSubject || 5);
        }
    }
    async submitOnboardingQuiz(userId, quizAnswers) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const analysis = await this.createQuizAnalysisWorkflow(quizAnswers.answers);
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
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    weakSubjects: analysis.weakSubjects || [],
                    onboardingStatus: client_1.OnboardingStatus.COMPLETED,
                },
            });
            return {
                analysis,
                weakSubjects: analysis.weakSubjects || [],
                recommendations: analysis.recommendations || {},
            };
        }
        catch (error) {
            console.error('Error submitting onboarding quiz:', error);
            throw new common_1.BadRequestException('Failed to submit quiz answers');
        }
    }
    async generatePersonalizedHomepage(userId, options) {
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
                throw new common_1.NotFoundException('User not found');
            }
            const result = await this.createPersonalizedHomepageWorkflow(user);
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
        }
        catch (error) {
            console.error('Error generating personalized homepage:', error);
            return this.generateFallbackHomepage(userId, options);
        }
    }
    async createQuizWorkflow(subjects, questionsPerSubject) {
        try {
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
            const response = await this.llm.invoke([new messages_1.HumanMessage(prompt)]);
            const content = this.cleanJsonResponse(response.content);
            const quizData = JSON.parse(content);
            return quizData;
        }
        catch (error) {
            console.error('Error in quiz generation workflow:', error);
            return this.generateFallbackQuiz(subjects, questionsPerSubject);
        }
    }
    async createQuizAnalysisWorkflow(answers) {
        try {
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
            const response = await this.llm.invoke([new messages_1.HumanMessage(prompt)]);
            const content = this.cleanJsonResponse(response.content);
            const analysis = JSON.parse(content);
            return analysis;
        }
        catch (error) {
            console.error('Error in quiz analysis workflow:', error);
            return {
                weakSubjects: [],
                recommendations: {},
                subjectScores: {},
                weakAreas: []
            };
        }
    }
    async createPersonalizedHomepageWorkflow(user) {
        try {
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
            const response = await this.llm.invoke([new messages_1.HumanMessage(prompt)]);
            const content = this.cleanJsonResponse(response.content);
            const recommendations = JSON.parse(content);
            return recommendations;
        }
        catch (error) {
            console.error('Error in personalized homepage workflow:', error);
            return {
                priorityAreas: user.weakSubjects || [],
                studyPlan: {},
                motivation: 'Keep learning and growing!',
                weakSubjectRecommendations: {}
            };
        }
    }
    async getRecommendedLessons(user, count) {
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
    async getRecommendedQuizzes(user, count) {
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
    async getProgressAnalytics(userId) {
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
    generateFallbackQuiz(subjects, questionsPerSubject) {
        const fallbackQuestions = subjects.flatMap(subject => Array.from({ length: questionsPerSubject }, (_, i) => ({
            id: `${subject}_q${i + 1}`,
            subject,
            question: `Sample question ${i + 1} for ${subject}`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            type: 'multiple_choice',
        })));
        return {
            questions: fallbackQuestions,
            subjects,
            totalQuestions: fallbackQuestions.length,
        };
    }
    async generateFallbackHomepage(userId, options) {
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
    async getParentRequests(studentId) {
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
    async approveParentRequest(studentId, connectionId) {
        const connection = await this.prisma.parentStudentConnection.findFirst({
            where: {
                id: connectionId,
                studentId,
                connectionStatus: 'pending',
            },
        });
        if (!connection) {
            throw new common_1.NotFoundException('Connection request not found');
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
    async rejectParentRequest(studentId, connectionId) {
        const connection = await this.prisma.parentStudentConnection.findFirst({
            where: {
                id: connectionId,
                studentId,
                connectionStatus: 'pending',
            },
        });
        if (!connection) {
            throw new common_1.NotFoundException('Connection request not found');
        }
        await this.prisma.parentStudentConnection.update({
            where: { id: connectionId },
            data: {
                connectionStatus: 'rejected',
            },
        });
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
    async getConnectedParents(studentId) {
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
};
exports.UserOnboardingService = UserOnboardingService;
exports.UserOnboardingService = UserOnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserOnboardingService);
//# sourceMappingURL=user-onboarding.service.js.map