import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

@Injectable()
export class AiChatService {
  private llm: ChatGoogleGenerativeAI;

  constructor(private prisma: PrismaService) {
    if (process.env.GOOGLE_API_KEY) {
      this.llm = new ChatGoogleGenerativeAI({
        model: 'gemini-1.5-flash',
        temperature: 0.7,
        apiKey: process.env.GOOGLE_API_KEY,
      });
    }
  }

  async processMessage(userId: string, message: string, context?: string) {
    try {
      // Kullanıcı bilgilerini al
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Son değerlendirme sonuçlarını al
      const latestAssessment = await this.prisma.assessmentResult.findFirst({
        where: { userId: user.id, assessmentType: 'onboarding' },
        orderBy: { createdAt: 'desc' }
      });

      // Sohbet geçmişini al (son 5 mesaj)
      const recentMessages = await this.prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 10
      });

      // AI için kişiselleştirilmiş prompt oluştur
      const systemPrompt = `
        Sen bir eğitim asistanısın. Öğrenci ile Türkçe konuşuyorsun.
        
        Öğrenci Profili:
        - İsim: ${user.firstName || 'Öğrenci'}
        - Sınıf: ${user.gradeLevel || 'Belirtilmemiş'}
        - Zayıf Dersler: ${user.weakSubjects?.join(', ') || 'Henüz tespit edilmemiş'}
        - Son Değerlendirme Puanı: ${latestAssessment?.score || 'Henüz değerlendirme yapılmamış'}
        
        ${(latestAssessment as any)?.metadata ? `Detaylı Analiz: ${JSON.stringify((latestAssessment as any).metadata)}` : ''}
        
        Görevlerin:
        1. Öğrenciye kişiselleştirilmiş eğitim desteği sağla
        2. Zayıf olduğu konularda özel yardım et
        3. Motivasyonel destek ver
        4. Çalışma planı öner
        5. Konuları basit ve anlaşılır şekilde açıkla
        6. Öğrencinin seviyesine uygun örnekler ver
        
        Kurallar:
        - Her zaman pozitif ve destekleyici ol
        - Öğrencinin seviyesine uygun dil kullan
        - Karmaşık konuları basitleştir
        - Örneklerle açıkla
        - Cesaretlendirici ol
      `;

      let conversationHistory = '';
      if (recentMessages.length > 0) {
        conversationHistory = '\n\nSon Sohbet Geçmişi:\n';
        recentMessages.reverse().forEach(msg => {
          conversationHistory += `${msg.role === 'user' ? 'Öğrenci' : 'AI'}: ${msg.content}\n`;
        });
      }

      const fullPrompt = `${systemPrompt}${conversationHistory}\n\nÖğrenci Mesajı: ${message}${context ? `\n\nEk Bağlam: ${context}` : ''}`;

      let aiResponse;
      if (this.llm) {
        const response = await this.llm.invoke([new HumanMessage(fullPrompt)]);
        aiResponse = response.content as string;
      } else {
        aiResponse = this.generateFallbackResponse(message, user);
      }

      // Mesajları veritabanına kaydet
      await this.prisma.chatMessage.createMany({
        data: [
          {
            userId,
            content: message,
            role: 'user',
            timestamp: new Date()
          },
          {
            userId,
            content: aiResponse,
            role: 'assistant',
            timestamp: new Date()
          }
        ]
      });

      return {
        response: aiResponse,
        timestamp: new Date(),
        context: {
          userLevel: user.gradeLevel,
          weakSubjects: user.weakSubjects,
          lastScore: latestAssessment?.score
        }
      };

    } catch (error) {
      console.error('AI Chat Error:', error);
      return {
        response: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date(),
        error: true
      };
    }
  }

  async getConversationHistory(userId: string, limit: number = 20) {
    const messages = await this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return messages.reverse();
  }

  async generateStudySuggestions(userId: string, subject?: string, difficulty?: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const latestAssessment = await this.prisma.assessmentResult.findFirst({
        where: { userId: user.id, assessmentType: 'onboarding' },
        orderBy: { createdAt: 'desc' }
      });

      const prompt = `
        ${user.firstName || 'Öğrenci'} için kişiselleştirilmiş çalışma önerileri oluştur.
        
        Öğrenci Bilgileri:
        - Sınıf: ${user.gradeLevel}
        - Zayıf Dersler: ${user.weakSubjects?.join(', ')}
        - İstenilen Ders: ${subject || 'Genel'}
        - Zorluk: ${difficulty || 'Orta'}
        - Son Değerlendirme: ${JSON.stringify((latestAssessment as any)?.metadata || {})}
        
        JSON formatında öneriler oluştur:
        {
          "dailyPlan": {
            "morning": "sabah çalışma önerisi",
            "afternoon": "öğleden sonra önerisi",
            "evening": "akşam tekrar önerisi"
          },
          "weeklyGoals": ["haftalık hedefler"],
          "studyTechniques": ["önerilen çalışma teknikleri"],
          "practiceQuestions": ["pratik soru önerileri"],
          "motivationalTips": ["motivasyon ipuçları"]
        }
      `;

      if (this.llm) {
        const response = await this.llm.invoke([new HumanMessage(prompt)]);
        const content = this.cleanJsonResponse(response.content as string);
        return JSON.parse(content);
      } else {
        return this.generateFallbackStudySuggestions(user, subject);
      }

    } catch (error) {
      console.error('Study Suggestions Error:', error);
      return this.generateFallbackStudySuggestions({ weakSubjects: ['Matematik'] }, subject);
    }
  }

  async explainTopic(userId: string, topic: string, subject: string, level?: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const prompt = `
        ${user?.gradeLevel || level || '8. Sınıf'} seviyesindeki bir öğrenciye "${topic}" konusunu ${subject} dersi kapsamında açıkla.
        
        Açıklama şu şekilde olmalı:
        1. Basit ve anlaşılır dil kullan
        2. Günlük hayattan örnekler ver
        3. Adım adım açıkla
        4. Önemli noktaları vurgula
        5. Pratik ipuçları ekle
        
        JSON formatında yanıt ver:
        {
          "explanation": "detaylı açıklama",
          "examples": ["günlük hayat örnekleri"],
          "keyPoints": ["önemli noktalar"],
          "practicalTips": ["pratik ipuçları"],
          "relatedTopics": ["ilgili konular"]
        }
      `;

      if (this.llm) {
        const response = await this.llm.invoke([new HumanMessage(prompt)]);
        const content = this.cleanJsonResponse(response.content as string);
        return JSON.parse(content);
      } else {
        return this.generateFallbackExplanation(topic, subject);
      }

    } catch (error) {
      console.error('Topic Explanation Error:', error);
      return this.generateFallbackExplanation(topic, subject);
    }
  }

  async provideMotivationalSupport(userId: string, mood?: string, challenge?: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      const prompt = `
        ${user?.firstName || 'Öğrenci'} adlı öğrenciye motivasyon desteği sağla.
        
        Durum:
        - Ruh Hali: ${mood || 'Belirsiz'}
        - Yaşadığı Zorluk: ${challenge || 'Genel motivasyon eksikliği'}
        - Sınıf: ${user?.gradeLevel || 'Belirtilmemiş'}
        
        JSON formatında motivasyon paketi oluştur:
        {
          "encouragingMessage": "cesaretlendirici mesaj",
          "practicalAdvice": ["pratik tavsiyeler"],
          "successStories": ["başarı hikayeleri"],
          "dailyAffirmations": ["günlük olumlamalar"],
          "actionSteps": ["atılacak adımlar"]
        }
      `;

      if (this.llm) {
        const response = await this.llm.invoke([new HumanMessage(prompt)]);
        const content = this.cleanJsonResponse(response.content as string);
        return JSON.parse(content);
      } else {
        return this.generateFallbackMotivation(user?.firstName || 'Öğrenci');
      }

    } catch (error) {
      console.error('Motivational Support Error:', error);
      return this.generateFallbackMotivation('Öğrenci');
    }
  }

  private cleanJsonResponse(content: string): string {
    // JSON yanıtını temizle
    let cleaned = content.trim();
    
    // Markdown kod bloklarını kaldır
    cleaned = cleaned.replace(/```json\s*|```\s*/g, '');
    
    // Başlangıç ve bitiş karakterlerini kontrol et
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.substring(start, end + 1);
    }
    
    return cleaned;
  }

  private generateFallbackResponse(message: string, user: any): string {
    const responses = [
      `Merhaba ${user.firstName || 'öğrenci'}! Sana nasıl yardımcı olabilirim?`,
      `${message} hakkında soru sorduğun için teşekkürler. Bu konuda sana yardımcı olmaya çalışacağım.`,
      `Anlıyorum, ${user.gradeLevel || 'sınıf'} seviyesinde bu konu zor olabilir. Adım adım açıklayayım.`,
      `Harika bir soru! Bu konuyu daha iyi anlamana yardımcı olacak örnekler verebilirim.`,
      `Merak ettiğin konuyu basit bir şekilde açıklayayım. Önce temel kavramları anlayalım.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateFallbackStudySuggestions(user: any, subject?: string) {
    const weakSubject = user.weakSubjects?.[0] || subject || 'Matematik';
    
    return {
      dailyPlan: {
        morning: `${weakSubject} dersinde 30 dakika temel konu tekrarı`,
        afternoon: 'Öğrendiğin konularla ilgili pratik sorular çöz',
        evening: 'Günün öğrendiklerini 15 dakika tekrar et'
      },
      weeklyGoals: [
        `${weakSubject} dersinde %10 ilerleme kaydet`,
        'Her gün en az 1 saat düzenli çalışma yap',
        'Haftalık 3 quiz tamamla'
      ],
      studyTechniques: [
        'Pomodoro tekniği ile 25 dakika odaklanma',
        'Öğrendiklerini kendi cümlelerinle açıklama',
        'Görsel materyaller kullanma',
        'Düzenli tekrar yapma'
      ],
      practiceQuestions: [
        `${weakSubject} temel seviye sorular`,
        'Karışık konu quizleri',
        'Günlük pratik alıştırmaları'
      ],
      motivationalTips: [
        'Her küçük ilerlemeyi kutla',
        'Hedeflerini küçük parçalara böl',
        'Düzenli mola ver',
        'Başarılarını takip et'
      ]
    };
  }

  private generateFallbackExplanation(topic: string, subject: string) {
    return {
      explanation: `${topic} konusu ${subject} dersinin önemli konularından biridir. Bu konuyu anlamak için temel kavramları öğrenmek gerekir.`,
      examples: [
        'Günlük hayattan basit örnekler',
        'Pratik uygulamalar',
        'Görsel açıklamalar'
      ],
      keyPoints: [
        'Temel kavramları anla',
        'Formülleri ezberle',
        'Bol pratik yap',
        'Düzenli tekrar et'
      ],
      practicalTips: [
        'Adım adım çöz',
        'Örnekleri incele',
        'Farklı soru tipleri çöz',
        'Yardım almaktan çekinme'
      ],
      relatedTopics: [
        'İlgili temel konular',
        'Önkoşul bilgiler',
        'İleri seviye konular'
      ]
    };
  }

  private generateFallbackMotivation(userName: string) {
    return {
      encouragingMessage: `${userName}, sen harikasın! Her zorluk aslında yeni bir öğrenme fırsatıdır. Kendine güven ve adım adım ilerle.`,
      practicalAdvice: [
        'Küçük hedefler belirle ve onları gerçekleştir',
        'Her gün biraz ilerleme kaydet',
        'Zorlandığında mola ver ve tekrar dene',
        'Başarılarını kutlamayı unutma'
      ],
      successStories: [
        'Birçok başarılı insan da senin yaşında zorluklarla karşılaştı',
        'Azim ve çalışmayla her hedef ulaşılabilir',
        'Her hata yeni bir öğrenme fırsatıdır'
      ],
      dailyAffirmations: [
        'Ben başarılı bir öğrenciyim',
        'Her gün daha da gelişiyorum',
        'Zorluklarla başa çıkabilirim',
        'Hedeflerime ulaşacağım'
      ],
      actionSteps: [
        'Bugün küçük bir hedef belirle',
        '30 dakika odaklanarak çalış',
        'İlerlemeini kaydet',
        'Kendini ödüllendir'
      ]
    };
  }
}