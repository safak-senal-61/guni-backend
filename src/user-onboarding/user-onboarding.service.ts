import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentAnalysisService } from '../content-analysis/content-analysis.service';

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
    private readonly contentAnalysisService: ContentAnalysisService,
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

      // Use enhanced content analysis for quiz generation
      const enhancedQuizData = {
        subject: quizData.subjects.join(', '),
        gradeLevel: user.gradeLevel || 'GRADE_5',
        difficultyLevel: user.profile?.difficultyPreference || 'medium',
        questionType: 'multiple_choice',
        learningObjectives: user.profile?.goals || ['Temel kavramları öğrenme'],
        keyTopics: quizData.subjects,
        language: 'tr'
      };

      const result = await this.contentAnalysisService.generateQuizQuestionsEnhanced(
        'Quiz içeriği',
        5,
        userId,
        enhancedQuizData.subject,
        enhancedQuizData.gradeLevel,
        enhancedQuizData.difficultyLevel,
        enhancedQuizData.questionType,
        Array.isArray(enhancedQuizData.learningObjectives) ? enhancedQuizData.learningObjectives.join(', ') : enhancedQuizData.learningObjectives,
        Array.isArray(enhancedQuizData.keyTopics) ? enhancedQuizData.keyTopics.join(', ') : enhancedQuizData.keyTopics,
        enhancedQuizData.language
      );
      
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

      // Use enhanced content analysis for quiz result analysis
      const quizContent = quizAnswers.answers.map(answer => 
        `Soru ${answer.questionId} (${answer.subject}): ${answer.answer}`
      ).join('\n');
      
      const enhancedAnalysisData = {
        subject: 'Kapsamlı Değerlendirme',
        gradeLevel: user.gradeLevel || 'GRADE_5',
        learningObjectives: user.profile?.goals || ['Akademik gelişim'],
        analysisType: 'educational'
      };

      const analysis = await this.contentAnalysisService.analyzeContentWorkflowEnhanced(
        quizContent,
        userId,
        enhancedAnalysisData.analysisType,
        enhancedAnalysisData.subject,
        enhancedAnalysisData.gradeLevel,
        Array.isArray(enhancedAnalysisData.learningObjectives) ? enhancedAnalysisData.learningObjectives.join(', ') : enhancedAnalysisData.learningObjectives
      );

      // Save comprehensive assessment result
      await this.prisma.assessmentResult.create({
        data: {
          userId,
          subject: 'Kapsamlı Değerlendirme',
          score: analysis.overallScore,
          totalQuestions: 20,
          correctAnswers: Math.round((analysis.overallScore / 100) * 20),
          weakAreas: analysis.weakAreas || [],
          recommendations: analysis.recommendations || {},
          assessmentType: 'onboarding',
          metadata: {
            subjectScores: analysis.subjectScores,
            studyPlan: analysis.studyPlan,
            personalizedContent: analysis.personalizedContent,
            learningPath: analysis.learningPath
          } as any
        },
      });

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
        strongSubjects: analysis.strongSubjects || [],
        recommendations: analysis.recommendations || {},
        studyPlan: analysis.studyPlan || {},
        personalizedContent: analysis.personalizedContent || {},
        overallScore: analysis.overallScore,
        subjectScores: analysis.subjectScores || {},
        learningPath: analysis.learningPath || []
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

      // Use enhanced content analysis for personalized homepage generation
      const userProgressContent = `
        Kullanıcı Profili:
        - Yaş: ${user.age}
        - Sınıf: ${user.gradeLevel}
        - Zayıf Konular: ${user.weakSubjects?.join(', ') || 'Belirtilmemiş'}
        - Öğrenme Stili: ${user.profile?.learningStyle || 'Belirtilmemiş'}
        - İlgi Alanları: ${user.profile?.interests?.join(', ') || 'Belirtilmemiş'}
        - Hedefler: ${user.profile?.goals?.join(', ') || 'Belirtilmemiş'}
        
        Son Aktiviteler:
        - Tamamlanan Dersler: ${user.lessonsCompleted?.length || 0}
        - Çözülen Quizler: ${user.quizzesTaken?.length || 0}
        - Son Değerlendirme Sonuçları: ${user.assessmentResults?.length || 0} adet
      `;
      
      const enhancedHomepageData = {
        subject: 'Kişiselleştirilmiş Ana Sayfa',
        gradeLevel: user.gradeLevel || 'GRADE_5',
        learningObjectives: user.profile?.goals || ['Akademik gelişim', 'Kişisel gelişim'],
        analysisType: 'educational'
      };

      const result = await this.contentAnalysisService.analyzeContentWorkflowEnhanced(
        user.id,
        userProgressContent,
        enhancedHomepageData.subject,
        enhancedHomepageData.gradeLevel,
        Array.isArray(enhancedHomepageData.learningObjectives) ? enhancedHomepageData.learningObjectives.join(', ') : enhancedHomepageData.learningObjectives,
        enhancedHomepageData.analysisType
      );
      
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
        return this.generateFallbackAnalysis(answers);
      }

      const prompt = `
        20 soruluk kapsamlı değerlendirme testinin sonuçlarını analiz et ve detaylı öğrenci profili oluştur:
        
        Test Cevapları: ${JSON.stringify(answers)}
        
        Lütfen analizi aşağıdaki JSON formatında ver:
        {
          "overallScore": number (0-100),
          "subjectScores": {
            "Matematik": score,
            "Türkçe": score,
            "Fen Bilimleri": score,
            "Sosyal Bilgiler": score,
            "İngilizce": score,
            "Tarih": score,
            "Coğrafya": score,
            "Fizik": score
          },
          "weakSubjects": ["zayıf ders1", "zayıf ders2"],
          "strongSubjects": ["güçlü ders1", "güçlü ders2"],
          "weakAreas": ["eksik konular"],
          "recommendations": {
            "immediate": ["acil yapılacaklar"],
            "weekly": ["haftalık hedefler"],
            "monthly": ["aylık hedefler"]
          },
          "learningPath": ["öğrenme adımları"],
          "studyPlan": {
            "dailyMinutes": number,
            "prioritySubjects": ["öncelikli dersler"],
            "suggestedSchedule": {
              "morning": "sabah önerisi",
              "afternoon": "öğleden sonra önerisi",
              "evening": "akşam önerisi"
            }
          },
          "personalizedContent": {
            "motivationalMessage": "kişiselleştirilmiş motivasyon mesajı",
            "achievements": ["başarılar"],
            "nextGoals": ["sonraki hedefler"]
          }
        }
      `;

      const response = await this.llm.invoke([new HumanMessage(prompt)]);
      const content = this.cleanJsonResponse(response.content as string);
      const analysis = JSON.parse(content);
      
      return analysis;
    } catch (error) {
      console.error('Error in quiz analysis workflow:', error);
      return this.generateFallbackAnalysis(answers);
    }
  }

  private generateFallbackAnalysis(answers: any[]) {
    // Comprehensive fallback analysis for 20-question assessment
    const subjectQuestions = {
      'Matematik': ['1', '2', '3', '4'],
      'Türkçe': ['5', '6', '7'],
      'Fen Bilimleri': ['8', '9', '10'],
      'Sosyal Bilgiler': ['11', '12'],
      'İngilizce': ['13', '14'],
      'Tarih': ['15', '16'],
      'Coğrafya': ['17', '18'],
      'Fizik': ['19', '20']
    };

    const correctAnswers = {
      '1': '42', '2': '180°', '3': '5', '4': '2πr',
      '5': 'masa', '6': 'Ben (gizli)', '7': 'Kalbi taş gibi',
      '8': 'H2O', '9': 'Kloroplast', '10': 'Merkür',
      '11': '1923', '12': 'Anadolu Selçuklu Devleti',
      '13': 'Günaydın', '14': 'Present Continuous',
      '15': '1919', '16': 'İstanbul',
      '17': 'Kızılırmak', '18': 'Asya',
      '19': '300.000', '20': 'Yerçekimi'
    };

    const subjectScores = {};
    const subjectCorrect = {};
    const subjectTotal = {};

    // Initialize counters
    Object.keys(subjectQuestions).forEach(subject => {
      subjectCorrect[subject] = 0;
      subjectTotal[subject] = subjectQuestions[subject].length;
    });

    // Calculate scores based on answers
    answers.forEach(answer => {
      const questionId = answer.questionId;
      const userAnswer = answer.answer;
      const correctAnswer = correctAnswers[questionId];
      
      Object.keys(subjectQuestions).forEach(subject => {
        if (subjectQuestions[subject].includes(questionId)) {
          if (userAnswer === correctAnswer) {
            subjectCorrect[subject]++;
          }
        }
      });
    });

    // Calculate percentage scores
    Object.keys(subjectQuestions).forEach(subject => {
      subjectScores[subject] = Math.round((subjectCorrect[subject] / subjectTotal[subject]) * 100);
    });

    const scores = Object.values(subjectScores as any) as number[];
    const overallScore = Math.round(
      scores.reduce((a: number, b: number) => a + b, 0) / scores.length
    );

    const weakSubjects = Object.keys(subjectScores).filter(subject => subjectScores[subject] < 60);
    const strongSubjects = Object.keys(subjectScores).filter(subject => subjectScores[subject] >= 80);

    return {
      overallScore,
      subjectScores,
      weakSubjects,
      strongSubjects,
      weakAreas: weakSubjects.length > 0 ? [`${weakSubjects.join(', ')} konularında temel kavramlar`, 'Problem çözme becerileri'] : ['Genel tekrar'],
      recommendations: {
        immediate: weakSubjects.length > 0 ? [`${weakSubjects[0]} dersine odaklan`, 'Günlük 30 dakika çalışma'] : ['Mevcut seviyeni koru', 'Daha zor konulara geç'],
        weekly: ['Haftalık deneme sınavları çöz', 'Zayıf konuları tekrar et'],
        monthly: ['İlerleme değerlendirmesi yap', 'Hedefleri güncelle']
      },
      learningPath: [
        'Eksik konuları belirle',
        'Günlük çalışma planı oluştur',
        'Düzenli pratik yap',
        'İlerlemeyi takip et',
        'Hedefleri güncelle'
      ],
      studyPlan: {
        dailyMinutes: weakSubjects.length > 2 ? 60 : 45,
        prioritySubjects: weakSubjects.length > 0 ? weakSubjects.slice(0, 2) : ['Matematik', 'Türkçe'],
        suggestedSchedule: {
          morning: 'Matematik ve Fen Bilimleri',
          afternoon: 'Türkçe ve Sosyal Bilgiler',
          evening: 'İngilizce ve tekrar'
        }
      },
      personalizedContent: {
        motivationalMessage: overallScore >= 80 ? 'Harika! Çok başarılısın, böyle devam et!' : 
                           overallScore >= 60 ? 'İyi gidiyorsun! Biraz daha çalışmayla hedeflerine ulaşabilirsin.' : 
                           'Endişelenme! Doğru plan ve çalışmayla başarıya ulaşacaksın.',
        achievements: strongSubjects.length > 0 ? [`${strongSubjects.join(', ')} derslerinde başarılısın`] : ['Teste katıldın ve kendini değerlendirdin'],
        nextGoals: weakSubjects.length > 0 ? [`${weakSubjects[0]} dersinde %70 başarı`, 'Günlük çalışma alışkanlığı'] : ['Tüm derslerde %90 başarı', 'İleri seviye konular']
      }
    };
  }

  async generateWeaknessAnalysis(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { 
          profile: true,
          assessmentResults: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const latestAssessment = await this.prisma.assessmentResult.findFirst({
        where: { userId: user?.id, assessmentType: 'onboarding' },
        orderBy: { createdAt: 'desc' }
      });

      const weakSubjects = user?.weakSubjects || [];
      const assessmentData = (latestAssessment as any)?.metadata || {};
      
      // Use enhanced content analysis for weakness analysis
      const weaknessContent = `
        Öğrenci Zayıflık Analizi:
        - Zayıf Konular: ${weakSubjects.join(', ')}
        - Son Değerlendirme Puanı: ${latestAssessment?.score || 'Belirtilmemiş'}
        - Öğrenme Stili: ${user.profile?.learningStyle || 'Belirtilmemiş'}
        - Günlük Çalışma Saati: ${user.profile?.studyHours || 'Belirtilmemiş'}
        - Zorluk Tercihi: ${user.profile?.difficultyPreference || 'Belirtilmemiş'}
        - Son 5 Değerlendirme Sonucu: ${user.assessmentResults?.map(a => a.score).join(', ') || 'Yok'}
      `;
      
      const enhancedAnalysisData = {
        subject: 'Zayıflık Analizi ve Gelişim Planı',
        gradeLevel: user.gradeLevel || 'GRADE_5',
        learningObjectives: ['Zayıf konuları güçlendirme', 'Akademik performans artırma', 'Etkili çalışma stratejileri geliştirme'],
        analysisType: 'detailed'
      };

      const analysisResult = await this.contentAnalysisService.analyzeContentWorkflowEnhanced(
        weaknessContent,
        userId,
        enhancedAnalysisData.analysisType,
        enhancedAnalysisData.subject,
        enhancedAnalysisData.gradeLevel,
        Array.isArray(enhancedAnalysisData.learningObjectives) ? enhancedAnalysisData.learningObjectives.join(', ') : enhancedAnalysisData.learningObjectives
      );

      return {
        aiAnalysis: analysisResult,
        criticalWeaknesses: {
          subjects: weakSubjects.slice(0, 3),
          scores: (assessmentData as any)?.subjectScores || {},
          priorityLevel: 'high'
        },
        improvementAreas: {
          conceptualGaps: this.identifyConceptualGaps(assessmentData),
          skillDeficits: this.identifySkillDeficits(assessmentData),
          studyHabits: this.analyzeStudyHabits(user)
        },
        actionPlan: {
          immediate: [
            `${weakSubjects[0] || 'Matematik'} dersinde temel kavramları güçlendir`,
            'Günlük 30 dakika odaklanmış çalışma yap',
            'Haftalık ilerleme değerlendirmesi yap'
          ],
          shortTerm: [
            'Zayıf konularda %20 ilerleme kaydet',
            'Düzenli quiz çözme alışkanlığı kazanın',
            'Çalışma planını optimize et'
          ],
          longTerm: [
            'Genel akademik ortalamayı %75\'e çıkar',
            'Tüm derslerde minimum %70 başarı sağla',
            'Öz-yönelimli öğrenme becerileri geliştir'
          ]
        },
        targetMetrics: {
          weeklyGoals: {
            studyHours: 10,
            quizzesCompleted: 3,
            improvementPercentage: 10
          },
          monthlyTargets: {
            overallScore: 75,
            weakestSubjectScore: 70,
            consistencyRate: 85
          }
        }
      };

    } catch (error) {
      console.error('Weakness Analysis Error:', error);
      return this.generateFallbackWeaknessAnalysis();
    }
  }

  async generateProgressTracking(userId: string, period: string = 'weekly') {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      // Son değerlendirme sonuçlarını al
      const assessments = await this.prisma.assessmentResult.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: period === 'daily' ? 7 : period === 'weekly' ? 4 : 12
      });

      // Quiz denemelerini al
      const quizAttempts = await this.prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { attemptDate: 'desc' },
        take: 20
      });

      const currentDate = new Date();
      const periodData = this.calculatePeriodData(assessments, quizAttempts, period);

      return {
        currentPeriod: period,
        overallProgress: {
          currentScore: assessments[0]?.score || 0,
          previousScore: assessments[1]?.score || 0,
          improvement: this.calculateImprovement(assessments),
          trend: this.calculateTrend(assessments)
        },
        subjectProgress: this.calculateSubjectProgress(assessments),
        activityMetrics: {
          quizzesCompleted: quizAttempts.length,
          averageScore: this.calculateAverageScore(quizAttempts),
          studyStreak: this.calculateStudyStreak(quizAttempts),
          timeSpent: this.calculateTimeSpent(quizAttempts)
        },
        goals: {
          completed: this.calculateCompletedGoals(user, assessments),
          inProgress: this.getInProgressGoals(user),
          upcoming: this.getUpcomingGoals(user)
        },
        insights: {
          strengths: this.identifyStrengths(assessments),
          improvements: this.identifyImprovements(assessments),
          recommendations: this.generateRecommendations(user, assessments)
        }
      };

    } catch (error) {
      console.error('Progress Tracking Error:', error);
      return this.generateFallbackProgressTracking(period);
    }
  }

  async refreshRecommendations(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          assessmentResults: {
            orderBy: { createdAt: 'desc' },
            take: 3
          },
          quizzesTaken: {
            orderBy: { attemptDate: 'desc' },
            take: 5
          }
        }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Use enhanced content analysis for refreshing recommendations
      const userProgressContent = `
        Kullanıcı İlerleme Raporu:
        - Zayıf Konular: ${user.weakSubjects?.join(', ') || 'Belirtilmemiş'}
        - Son Değerlendirme Sonuçları: ${user.assessmentResults?.map(a => `${a.subject}: ${a.score}`).join(', ') || 'Yok'}
        - Quiz Performansı: ${user.quizzesTaken?.map(q => q.score).join(', ') || 'Yok'}
        - Öğrenme Hedefleri: ${user.profile?.goals?.join(', ') || 'Belirtilmemiş'}
        - İlgi Alanları: ${user.profile?.interests?.join(', ') || 'Belirtilmemiş'}
        - Günlük Çalışma Saati: ${user.profile?.studyHours || 'Belirtilmemiş'}
      `;
      
      const enhancedRecommendationData = {
        subject: 'Kişiselleştirilmiş Öğrenme Önerileri',
        gradeLevel: user.gradeLevel || 'GRADE_5',
        learningObjectives: user.profile?.goals || ['Akademik gelişim', 'Kişisel gelişim'],
        analysisType: 'educational'
      };

      const recommendationsResult = await this.contentAnalysisService.analyzeContentWorkflowEnhanced(
        userProgressContent,
        userId,
        enhancedRecommendationData.analysisType,
        enhancedRecommendationData.subject,
        enhancedRecommendationData.gradeLevel,
        Array.isArray(enhancedRecommendationData.learningObjectives) ? enhancedRecommendationData.learningObjectives.join(', ') : enhancedRecommendationData.learningObjectives
      );

      return {
        aiRecommendations: recommendationsResult,
        refreshedAt: new Date(),
        personalizedLessons: await this.getRecommendedLessons(user, 10),
        personalizedQuizzes: await this.getRecommendedQuizzes(user, 5),
        studyPlan: {
          dailyGoals: this.generateDailyGoals(user),
          weeklyTargets: this.generateWeeklyTargets(user),
          prioritySubjects: user.weakSubjects?.slice(0, 3) || []
        }
      };

    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      throw new BadRequestException('Failed to refresh recommendations');
    }
  }

  async generateStudyRecommendations(userId: string, focus: string = 'weaknesses') {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      const latestAssessment = await this.prisma.assessmentResult.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      const weakSubjects = user?.weakSubjects || [];
      const userLevel = user?.gradeLevel || 'GRADE_8';

      return {
        focusArea: focus,
        prioritySubjects: weakSubjects.slice(0, 3),
        dailyPlan: {
          morning: {
            duration: 30,
            activity: `${weakSubjects[0] || 'Matematik'} - Temel kavram çalışması`,
            type: 'concept-study'
          },
          afternoon: {
            duration: 25,
            activity: 'Pratik soru çözümü',
            type: 'practice'
          },
          evening: {
            duration: 15,
            activity: 'Günün tekrarı ve değerlendirme',
            type: 'review'
          }
        },
        weeklyPlan: {
          monday: 'Matematik temel konular',
          tuesday: 'Türkçe okuma anlama',
          wednesday: 'Fen Bilimleri deney ve uygulama',
          thursday: 'Sosyal Bilgiler konu tekrarı',
          friday: 'Karışık konu quiz çözümü',
          saturday: 'Haftalık değerlendirme',
          sunday: 'Dinlenme ve motivasyon'
        },
        studyTechniques: [
          {
            name: 'Pomodoro Tekniği',
            description: '25 dakika odaklanma, 5 dakika mola',
            bestFor: 'Konsantrasyon problemi yaşayanlar'
          },
          {
            name: 'Aktif Tekrar',
            description: 'Öğrendiklerini kendi cümlelerinle açıklama',
            bestFor: 'Kalıcı öğrenme'
          },
          {
            name: 'Görsel Haritalama',
            description: 'Konuları şema ve grafiklerle özetleme',
            bestFor: 'Görsel öğrenenler'
          }
        ],
        resources: {
          videos: this.getRecommendedVideos(weakSubjects),
          exercises: this.getRecommendedExercises(weakSubjects, userLevel),
          quizzes: this.getRecommendedQuizzesForSubjects(weakSubjects)
        },
        motivationalElements: {
          dailyQuote: 'Başarı, küçük çabaların günlük tekrarıdır.',
          weeklyChallenge: `Bu hafta ${weakSubjects[0] || 'matematik'} dersinde 3 yeni konu öğren!`,
          rewardSystem: {
            daily: 'Her gün hedefini tamamla, puan kazan!',
            weekly: 'Haftalık hedefleri tamamla, rozet kazan!',
            monthly: 'Aylık başarıları kutla, özel ödüller kazan!'
          }
        }
      };

    } catch (error) {
      console.error('Study Recommendations Error:', error);
      return this.generateFallbackStudyRecommendations(focus);
    }
  }

  async generateAchievementSummary(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      const assessments = await this.prisma.assessmentResult.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      const quizAttempts = await this.prisma.quizAttempt.findMany({
        where: { userId },
        orderBy: { attemptDate: 'desc' }
      });

      return {
        overallAchievements: {
          totalQuizzes: quizAttempts.length,
          averageScore: this.calculateAverageScore(quizAttempts),
          bestScore: Math.max(...quizAttempts.map(q => q.score), 0),
          improvementRate: this.calculateImprovementRate(assessments)
        },
        recentMilestones: [
          {
            title: 'İlk Değerlendirme Tamamlandı',
            date: assessments[0]?.createdAt || new Date(),
            description: 'Öğrenme yolculuğuna başladın!',
            icon: '🎯'
          },
          {
            title: `${quizAttempts.length} Quiz Tamamlandı`,
            date: quizAttempts[0]?.attemptDate || new Date(),
            description: 'Harika bir ilerleme!',
            icon: '📚'
          }
        ],
        strengthAreas: {
          subjects: this.identifyStrongSubjects(assessments),
          skills: ['Problem çözme', 'Analitik düşünme', 'Dikkat'],
          learningStyle: (user as any)?.profile?.learningStyle || 'Görsel'
        },
        motivationalStats: {
          daysActive: this.calculateActiveDays(quizAttempts),
          longestStreak: this.calculateLongestStreak(quizAttempts),
          totalStudyTime: this.calculateTotalStudyTime(quizAttempts),
          rank: 'Başlangıç Seviyesi'
        },
        nextGoals: [
          {
            title: 'Haftalık Hedef',
            description: '3 quiz tamamla',
            progress: Math.min((quizAttempts.length % 3) / 3 * 100, 100),
            deadline: this.getWeekEnd()
          },
          {
            title: 'Aylık Hedef',
            description: 'Genel ortalamayı %75\'e çıkar',
            progress: Math.min((this.calculateAverageScore(quizAttempts) / 75) * 100, 100),
            deadline: this.getMonthEnd()
          }
        ],
        encouragement: {
          message: `Harika gidiyorsun ${user?.firstName}! Her gün biraz daha ilerleyerek hedeflerine yaklaşıyorsun.`,
          tip: 'Düzenli çalışma en büyük başarı sırrıdır. Küçük adımlarla büyük hedeflere ulaşabilirsin!',
          nextAction: 'Bugün bir quiz çözerek günlük hedefini tamamla!'
        }
      };

    } catch (error) {
      console.error('Achievement Summary Error:', error);
      return this.generateFallbackAchievementSummary();
    }
  }

  // Helper methods
  private identifyConceptualGaps(assessmentData: any): string[] {
    return [
      'Temel matematik işlemleri',
      'Okuma anlama becerileri',
      'Bilimsel düşünme'
    ];
  }

  private identifySkillDeficits(assessmentData: any): string[] {
    return [
      'Problem çözme stratejileri',
      'Zaman yönetimi',
      'Not alma teknikleri'
    ];
  }

  private analyzeStudyHabits(user: any): string[] {
    return [
      'Düzenli çalışma alışkanlığı geliştirme',
      'Dikkat süresi artırma',
      'Motivasyon sürdürme'
    ];
  }

  private calculateImprovement(assessments: any[]): number {
    if (assessments.length < 2) return 0;
    const current = assessments[0]?.score || 0;
    const previous = assessments[1]?.score || 0;
    return current - previous;
  }

  private calculateTrend(assessments: any[]): string {
    const improvement = this.calculateImprovement(assessments);
    if (improvement > 5) return 'yükseliş';
    if (improvement < -5) return 'düşüş';
    return 'stabil';
  }

  private calculateSubjectProgress(assessments: any[]): any {
    if (!(assessments[0] as any)?.metadata?.subjectScores) {
      return {
        'Matematik': 65,
        'Türkçe': 70,
        'Fen Bilimleri': 60
      };
    }
    return (assessments[0] as any).metadata.subjectScores;
  }

  private calculateAverageScore(quizAttempts: any[]): number {
    if (quizAttempts.length === 0) return 0;
    const total = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
    return Math.round(total / quizAttempts.length);
  }

  private calculateStudyStreak(quizAttempts: any[]): number {
    // Basit streak hesaplama
    return Math.min(quizAttempts.length, 7);
  }

  private calculateTimeSpent(quizAttempts: any[]): number {
    return quizAttempts.reduce((total, attempt) => total + (attempt.timeTaken || 0), 0);
  }

  private getWeekEnd(): Date {
    const now = new Date();
    const daysUntilSunday = 7 - now.getDay();
    return new Date(now.getTime() + daysUntilSunday * 24 * 60 * 60 * 1000);
  }

  private getMonthEnd(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }

  private generateFallbackWeaknessAnalysis() {
    return {
      criticalWeaknesses: {
        subjects: ['Matematik', 'Fen Bilimleri'],
        scores: { 'Matematik': 60, 'Fen Bilimleri': 65 },
        priorityLevel: 'high'
      },
      improvementAreas: {
        conceptualGaps: ['Temel matematik işlemleri'],
        skillDeficits: ['Problem çözme'],
        studyHabits: ['Düzenli çalışma']
      },
      actionPlan: {
        immediate: ['Matematik temel konuları çalış'],
        shortTerm: ['Haftalık quiz çöz'],
        longTerm: ['Genel ortalamayı artır']
      }
    };
  }

  private generateFallbackProgressTracking(period: string) {
    return {
      currentPeriod: period,
      overallProgress: {
        currentScore: 65,
        previousScore: 60,
        improvement: 5,
        trend: 'yükseliş'
      },
      activityMetrics: {
        quizzesCompleted: 3,
        averageScore: 65,
        studyStreak: 5,
        timeSpent: 180
      }
    };
  }

  private generateDailyGoals(user: any): string[] {
    const weakSubjects = user.weakSubjects || [];
    const studyHours = user.profile?.studyHours || 2;
    
    return [
      `${Math.round(studyHours * 60 / 3)} dakika ${weakSubjects[0] || 'matematik'} çalışması`,
      'En az 1 quiz çözme',
      'Günlük ilerleme kaydı tutma'
    ];
  }

  private generateWeeklyTargets(user: any): string[] {
    const weakSubjects = user.weakSubjects || [];
    
    return [
      `${weakSubjects.length > 0 ? weakSubjects[0] : 'Matematik'} dersinde %10 ilerleme`,
      'Haftalık 5 quiz tamamlama',
      'Zayıf konularda 2 ders tamamlama'
    ];
  }

  private generateFallbackStudyRecommendations(focus: string) {
    return {
      focusArea: focus,
      prioritySubjects: ['Matematik', 'Türkçe'],
      dailyPlan: {
        morning: { duration: 30, activity: 'Matematik çalışması', type: 'study' },
        afternoon: { duration: 25, activity: 'Pratik sorular', type: 'practice' },
        evening: { duration: 15, activity: 'Günün tekrarı', type: 'review' }
      }
    };
  }

  private generateFallbackAchievementSummary() {
    return {
      overallAchievements: {
        totalQuizzes: 5,
        averageScore: 65,
        bestScore: 80,
        improvementRate: 10
      },
      recentMilestones: [
        {
          title: 'İlk Quiz Tamamlandı',
          date: new Date(),
          description: 'Harika bir başlangıç!',
          icon: '🎯'
        }
      ]
    };
  }

  // Additional helper methods
  private calculatePeriodData(assessments: any[], quizAttempts: any[], period: string) {
    // Period-specific data calculation logic
    return {};
  }

  private calculateCompletedGoals(user: any, assessments: any[]) {
    return [];
  }

  private getInProgressGoals(user: any) {
    return [];
  }

  private getUpcomingGoals(user: any) {
    return [];
  }

  private identifyStrengths(assessments: any[]) {
    return ['Analitik düşünme', 'Dikkat'];
  }

  private identifyImprovements(assessments: any[]) {
    return ['Matematik', 'Problem çözme'];
  }

  private generateRecommendations(user: any, assessments: any[]) {
    return ['Düzenli çalışma', 'Quiz çözme'];
  }

  private getRecommendedVideos(subjects: string[]) {
    return [];
  }

  private getRecommendedExercises(subjects: string[], level: string) {
    return [];
  }

  private getRecommendedQuizzesForSubjects(subjects: string[]) {
    return [];
  }

  private calculateImprovementRate(assessments: any[]) {
    return 10;
  }

  private identifyStrongSubjects(assessments: any[]) {
    return ['Sosyal Bilgiler', 'Tarih'];
  }

  private calculateActiveDays(quizAttempts: any[]) {
    return quizAttempts.length;
  }

  private calculateLongestStreak(quizAttempts: any[]) {
    return Math.min(quizAttempts.length, 7);
  }

  private calculateTotalStudyTime(quizAttempts: any[]) {
    return quizAttempts.reduce((total, attempt) => total + (attempt.timeTaken || 0), 0);
  }

  private async createPersonalizedHomepageWorkflow(user: any) {
    try {
      // Use mock data in test environment or when LLM is not available
      if (!this.llm || process.env.NODE_ENV === 'test') {
        return this.generateFallbackHomepage(user.id, {});
      }

      // Get latest assessment results
      const latestAssessment = await this.prisma.assessmentResult.findFirst({
        where: { userId: user.id, assessmentType: 'onboarding' },
        orderBy: { createdAt: 'desc' }
      });

      const prompt = `
        Öğrenci profiline göre kişiselleştirilmiş ana sayfa oluştur:
        
        Kullanıcı Profili: ${JSON.stringify(user, null, 2)}
        Son Değerlendirme: ${JSON.stringify((latestAssessment as any)?.metadata || {}, null, 2)}
        
        JSON formatında içerik oluştur:
        {
          "welcomeMessage": "kişiselleştirilmiş hoş geldin mesajı",
          "dailyGoals": [
            {
              "title": "günlük hedef",
              "subject": "ders",
              "type": "study/quiz/review",
              "estimatedTime": "dakika",
              "priority": "high/medium/low"
            }
          ],
          "weaknessAnalysis": {
            "criticalAreas": ["kritik eksik alanlar"],
            "improvementPlan": ["iyileştirme adımları"],
            "targetScores": {"ders": "hedef puan"}
          },
          "strengthsHighlight": {
            "topSubjects": ["güçlü dersler"],
            "achievements": ["başarılar"],
            "encouragement": "motivasyon mesajı"
          },
          "studyRecommendations": [
            {
              "title": "önerilen çalışma",
              "subject": "ders",
              "type": "lesson/practice/quiz",
              "difficulty": "kolay/orta/zor",
              "reason": "öneri sebebi",
              "estimatedTime": "dakika"
            }
          ],
          "progressTracking": {
            "overallProgress": "genel ilerleme yüzdesi",
            "subjectProgress": {"ders": "ilerleme"},
            "weeklyGoals": ["haftalık hedefler"],
            "monthlyTargets": ["aylık hedefler"]
          },
          "chatSuggestions": [
            "AI ile sorulabilecek örnek sorular"
          ]
        }
      `;

      const response = await this.llm.invoke([new HumanMessage(prompt)]);
      const content = this.cleanJsonResponse(response.content as string);
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse homepage response:', parseError);
        return this.generateFallbackHomepage(user.id, {});
      }
    } catch (error) {
      console.error('Error in personalized homepage workflow:', error);
      return this.generateFallbackHomepage(user.id, {});
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
    // Comprehensive 20-question assessment quiz covering multiple subjects
    const fallbackQuestions = [
      // Matematik Soruları
      {
        id: '1',
        subject: 'Matematik',
        question: '15 + 27 = ?',
        options: ['42', '41', '43', '40'],
        correctAnswer: '42',
        difficulty: 'kolay',
        gradeLevel: '5-8',
      },
      {
        id: '2',
        subject: 'Matematik',
        question: 'Bir üçgenin iç açıları toplamı kaç derecedir?',
        options: ['180°', '360°', '90°', '270°'],
        correctAnswer: '180°',
        difficulty: 'orta',
        gradeLevel: '6-9',
      },
      {
        id: '3',
        subject: 'Matematik',
        question: '2x + 5 = 15 denkleminde x kaçtır?',
        options: ['5', '10', '7', '3'],
        correctAnswer: '5',
        difficulty: 'orta',
        gradeLevel: '7-10',
      },
      {
        id: '4',
        subject: 'Matematik',
        question: 'Bir dairenin çevresi nasıl hesaplanır?',
        options: ['2πr', 'πr²', 'πd', 'r²'],
        correctAnswer: '2πr',
        difficulty: 'orta',
        gradeLevel: '8-11',
      },
      // Türkçe Soruları
      {
        id: '5',
        subject: 'Türkçe',
        question: 'Aşağıdaki kelimelerden hangisi isimdir?',
        options: ['koşmak', 'güzel', 'masa', 'hızlı'],
        correctAnswer: 'masa',
        difficulty: 'kolay',
        gradeLevel: '5-8',
      },
      {
        id: '6',
        subject: 'Türkçe',
        question: '"Kitabı okudum." cümlesinde özne nedir?',
        options: ['Ben (gizli)', 'Kitabı', 'okudum', 'Özne yok'],
        correctAnswer: 'Ben (gizli)',
        difficulty: 'orta',
        gradeLevel: '6-9',
      },
      {
        id: '7',
        subject: 'Türkçe',
        question: 'Hangi kelime mecaz anlamda kullanılmıştır?',
        options: ['Kalbi taş gibi', 'Taş ev', 'Taş yol', 'Taş duvar'],
        correctAnswer: 'Kalbi taş gibi',
        difficulty: 'orta',
        gradeLevel: '7-10',
      },
      // Fen Bilimleri Soruları
      {
        id: '8',
        subject: 'Fen Bilimleri',
        question: 'Suyun kimyasal formülü nedir?',
        options: ['H2O', 'CO2', 'NaCl', 'O2'],
        correctAnswer: 'H2O',
        difficulty: 'kolay',
        gradeLevel: '5-8',
      },
      {
        id: '9',
        subject: 'Fen Bilimleri',
        question: 'Fotosentez olayı hangi organellerde gerçekleşir?',
        options: ['Kloroplast', 'Mitokondri', 'Ribozom', 'Çekirdek'],
        correctAnswer: 'Kloroplast',
        difficulty: 'orta',
        gradeLevel: '6-9',
      },
      {
        id: '10',
        subject: 'Fen Bilimleri',
        question: 'Hangi gezegen Güneş\'e en yakındır?',
        options: ['Merkür', 'Venüs', 'Mars', 'Dünya'],
        correctAnswer: 'Merkür',
        difficulty: 'kolay',
        gradeLevel: '5-8',
      },
      // Sosyal Bilgiler Soruları
      {
        id: '11',
        subject: 'Sosyal Bilgiler',
        question: 'Türkiye Cumhuriyeti hangi yıl kurulmuştur?',
        options: ['1923', '1920', '1922', '1924'],
        correctAnswer: '1923',
        difficulty: 'kolay',
        gradeLevel: '5-8',
      },
      {
        id: '12',
        subject: 'Sosyal Bilgiler',
        question: 'Anadolu\'nun ilk Türk devleti hangisidir?',
        options: ['Anadolu Selçuklu Devleti', 'Osmanlı Devleti', 'Danişmendliler', 'Karamanoğulları'],
        correctAnswer: 'Anadolu Selçuklu Devleti',
        difficulty: 'orta',
        gradeLevel: '6-9',
      },
      // İngilizce Soruları
      {
        id: '13',
        subject: 'İngilizce',
        question: '"Good morning" ne anlama gelir?',
        options: ['Günaydın', 'İyi akşamlar', 'İyi geceler', 'Hoşça kal'],
        correctAnswer: 'Günaydın',
        difficulty: 'kolay',
        gradeLevel: '5-8',
      },
      {
        id: '14',
        subject: 'İngilizce',
        question: '"I am reading a book" cümlesinde hangi zaman kullanılmıştır?',
        options: ['Present Continuous', 'Simple Present', 'Past Tense', 'Future Tense'],
        correctAnswer: 'Present Continuous',
        difficulty: 'orta',
        gradeLevel: '6-9',
      },
      // Tarih Soruları
      {
        id: '15',
        subject: 'Tarih',
        question: 'Milli Mücadele hangi yıl başlamıştır?',
        options: ['1919', '1920', '1918', '1921'],
        correctAnswer: '1919',
        difficulty: 'orta',
        gradeLevel: '7-10',
      },
      {
        id: '16',
        subject: 'Tarih',
        question: 'Fatih Sultan Mehmet hangi şehri fethetmiştir?',
        options: ['İstanbul', 'Bursa', 'Edirne', 'Ankara'],
        correctAnswer: 'İstanbul',
        difficulty: 'kolay',
        gradeLevel: '6-9',
      },
      // Coğrafya Soruları
      {
        id: '17',
        subject: 'Coğrafya',
        question: 'Türkiye\'nin en uzun nehri hangisidir?',
        options: ['Kızılırmak', 'Sakarya', 'Fırat', 'Dicle'],
        correctAnswer: 'Kızılırmak',
        difficulty: 'orta',
        gradeLevel: '6-9',
      },
      {
        id: '18',
        subject: 'Coğrafya',
        question: 'Dünya\'nın en büyük kıtası hangisidir?',
        options: ['Asya', 'Afrika', 'Avrupa', 'Kuzey Amerika'],
        correctAnswer: 'Asya',
        difficulty: 'kolay',
        gradeLevel: '5-8',
      },
      // Fizik Soruları
      {
        id: '19',
        subject: 'Fizik',
        question: 'Işığın hızı yaklaşık olarak kaç km/s\'dir?',
        options: ['300.000', '150.000', '450.000', '200.000'],
        correctAnswer: '300.000',
        difficulty: 'orta',
        gradeLevel: '8-11',
      },
      {
        id: '20',
        subject: 'Fizik',
        question: 'Hangi kuvvet cismi Dünya\'ya çeker?',
        options: ['Yerçekimi', 'Sürtünme', 'Manyetik', 'Elektrik'],
        correctAnswer: 'Yerçekimi',
        difficulty: 'kolay',
        gradeLevel: '6-9',
      },
    ];

    // Always return exactly 20 questions for comprehensive assessment
    return {
      questions: fallbackQuestions,
      totalQuestions: 20,
      subjects: ['Matematik', 'Türkçe', 'Fen Bilimleri', 'Sosyal Bilgiler', 'İngilizce', 'Tarih', 'Coğrafya', 'Fizik'],
    };
  }

  private async generateFallbackHomepage(userId: string, options: PersonalizedHomepageDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get latest assessment for personalization
    const latestAssessment = await this.prisma.assessmentResult.findFirst({
      where: { userId: user.id, assessmentType: 'onboarding' },
      orderBy: { createdAt: 'desc' }
    });

    const weakSubjects = user.weakSubjects || ['Matematik', 'Fen Bilimleri'];
    const userGrade = user.gradeLevel || 'GRADE_8';
    const userName = user.firstName || 'Öğrenci';

    return {
      welcomeMessage: `Merhaba ${userName}! Bugün öğrenmeye hazır mısın? Senin için özel hazırladığımız içerikler seni bekliyor! 🎯`,
      dailyGoals: [
        {
          title: `${weakSubjects[0]} Temel Konular`,
          subject: weakSubjects[0],
          type: 'study',
          estimatedTime: '30',
          priority: 'high'
        },
        {
          title: 'Günlük Quiz Çözümü',
          subject: 'Genel',
          type: 'quiz',
          estimatedTime: '15',
          priority: 'medium'
        },
        {
          title: 'Dün Öğrendiklerini Tekrar Et',
          subject: 'Tekrar',
          type: 'review',
          estimatedTime: '20',
          priority: 'medium'
        }
      ],
      weaknessAnalysis: {
        criticalAreas: weakSubjects.slice(0, 2),
        improvementPlan: [
          `${weakSubjects[0]} dersinde temel kavramları güçlendir`,
          'Günlük 30 dakika düzenli çalışma yap',
          'Haftalık ilerleme değerlendirmesi yap'
        ],
        targetScores: {
          [weakSubjects[0]]: '75',
          [weakSubjects[1] || 'Türkçe']: '80'
        }
      },
      strengthsHighlight: {
        topSubjects: (latestAssessment as any)?.metadata?.strongSubjects || ['Sosyal Bilgiler', 'Tarih'],
        achievements: [
          'Değerlendirme testini tamamladın! 🎉',
          'Öğrenme yolculuğuna başladın',
          'Hedeflerini belirlemeye hazırsın'
        ],
        encouragement: 'Sen harikasın! Her gün biraz daha ilerleyerek hedeflerine ulaşacaksın. 💪'
      },
      studyRecommendations: [
        {
          title: `${weakSubjects[0]} - Temel Kavramlar`,
          subject: weakSubjects[0],
          type: 'lesson',
          difficulty: 'kolay',
          reason: 'En çok gelişime ihtiyaç duyduğun alan',
          estimatedTime: '25'
        },
        {
          title: 'Karışık Konu Quizi',
          subject: 'Genel',
          type: 'quiz',
          difficulty: 'orta',
          reason: 'Genel seviyeni ölçmek için',
          estimatedTime: '20'
        },
        {
          title: `${weakSubjects[1] || 'Türkçe'} Pratik Soruları`,
          subject: weakSubjects[1] || 'Türkçe',
          type: 'practice',
          difficulty: 'orta',
          reason: 'İkinci öncelikli gelişim alanın',
          estimatedTime: '30'
        }
      ],
      progressTracking: {
        overallProgress: latestAssessment?.score?.toString() || '0',
        subjectProgress: (latestAssessment as any)?.metadata?.subjectScores || {
          'Matematik': '60',
          'Türkçe': '70',
          'Fen Bilimleri': '65'
        },
        weeklyGoals: [
          'Her gün 30 dakika çalışma',
          '3 quiz tamamlama',
          'Zayıf konularda %10 ilerleme'
        ],
        monthlyTargets: [
          'Genel ortalamayı %75\'e çıkarma',
          'En zayıf derste %70 başarı',
          'Düzenli çalışma alışkanlığı kazanma'
        ]
      },
      chatSuggestions: [
        `${weakSubjects[0]} konusunda hangi konuları çalışmalıyım?`,
        'Bugün ne kadar çalışma yapmam gerekiyor?',
        'Hangi konularda daha çok pratik yapmalıyım?',
        'Çalışma planımı nasıl düzenleyebilirim?',
        'Motivasyonum düştüğünde ne yapmalıyım?'
      ]
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