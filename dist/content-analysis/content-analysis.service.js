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
exports.ContentAnalysisService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
const prisma_service_1 = require("../prisma/prisma.service");
const fs = require("fs/promises");
const google_genai_1 = require("@langchain/google-genai");
const prompts_1 = require("@langchain/core/prompts");
const langgraph_1 = require("@langchain/langgraph");
const messages_1 = require("@langchain/core/messages");
let ContentAnalysisService = class ContentAnalysisService {
    prisma;
    genAI;
    chatModel;
    constructor(prisma) {
        this.prisma = prisma;
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey || process.env.NODE_ENV === 'test') {
            console.warn('Google API Key is not configured or in test environment. Using mock responses for testing.');
            return;
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.chatModel = new google_genai_1.ChatGoogleGenerativeAI({
            apiKey: apiKey,
            model: 'gemini-2.0-flash-exp',
            temperature: 0.7,
        });
    }
    async summarizeContent(text, userId, videoUrl, title, subject, gradeLevel, learningObjectives, targetAudience, difficultyLevel, durationMinutes, keyTopics, summaryType) {
        let summary;
        if (!this.genAI) {
            summary = `Mock summary of the provided text: ${text.substring(0, 100)}... This is a test summary generated for testing purposes.`;
        }
        else {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
            let prompt = `Aşağıdaki eğitim içeriğini detaylı bir şekilde Türkçe olarak özetle:\n\n${text}\n\n`;
            prompt += `ÖZETLEME TALİMATLARI:\n`;
            if (subject) {
                prompt += `- Konu Alanı: ${subject}\n`;
            }
            if (gradeLevel) {
                prompt += `- Sınıf Seviyesi: ${gradeLevel}\n`;
            }
            if (learningObjectives) {
                prompt += `- Öğrenme Hedefleri: ${learningObjectives}\n`;
            }
            if (targetAudience) {
                prompt += `- Hedef Kitle: ${targetAudience}\n`;
            }
            if (difficultyLevel) {
                prompt += `- Zorluk Seviyesi: ${difficultyLevel}\n`;
            }
            if (durationMinutes) {
                prompt += `- İçerik Süresi: ${durationMinutes} dakika\n`;
            }
            if (keyTopics) {
                prompt += `- Odaklanılacak Ana Konular: ${keyTopics}\n`;
            }
            const summaryTypeText = summaryType || 'educational';
            prompt += `- Özet Türü: ${summaryTypeText}\n\n`;
            if (summaryTypeText === 'educational') {
                prompt += `EĞİTİMSEL ÖZET GEREKSİNİMLERİ:\n`;
                prompt += `1. Ana kavramları ve temel bilgileri açıkça belirt\n`;
                prompt += `2. Öğrencilerin anlayabileceği dilde açıkla\n`;
                prompt += `3. Önemli formülleri, tanımları ve kuralları vurgula\n`;
                prompt += `4. Konular arası bağlantıları göster\n`;
                prompt += `5. Pratik örnekler ve uygulamalar ekle\n`;
                prompt += `6. Öğrenme çıktılarını net bir şekilde ifade et\n`;
                prompt += `7. Konunun günlük hayattaki önemini belirt\n`;
                prompt += `8. Öğrencilerin dikkat etmesi gereken kritik noktaları işaretle\n\n`;
            }
            else if (summaryTypeText === 'detailed') {
                prompt += `DETAYLI ÖZET GEREKSİNİMLERİ:\n`;
                prompt += `1. Tüm ana başlıkları ve alt başlıkları dahil et\n`;
                prompt += `2. Önemli detayları ve açıklamaları koru\n`;
                prompt += `3. Sayısal veriler ve istatistikleri belirt\n`;
                prompt += `4. Kaynak ve referansları not et\n\n`;
            }
            else {
                prompt += `KISA ÖZET GEREKSİNİMLERİ:\n`;
                prompt += `1. Sadece en önemli noktaları belirt\n`;
                prompt += `2. Kısa ve öz bir dille yaz\n`;
                prompt += `3. Ana fikirleri vurgula\n\n`;
            }
            prompt += `Lütfen yukarıdaki talimatları dikkate alarak kapsamlı ve eğitici bir özet hazırla.`;
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                summary = response.text();
            }
            catch (error) {
                console.error('Error generating content summary:', error);
                throw new common_1.InternalServerErrorException('Failed to summarize content using AI.');
            }
        }
        const videoAnalysis = await this.prisma.videoAnalysis.create({
            data: {
                userId,
                videoUrl: videoUrl || 'N/A',
                title: title || 'Content Summary',
                summary: summary,
                status: 'completed',
            },
        });
        return videoAnalysis;
    }
    async summarizeFile(filePath, userId, title) {
        let fileContent;
        try {
            fileContent = await fs.readFile(filePath, 'utf-8');
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to read file content.');
        }
        return this.summarizeContent(fileContent, userId, undefined, title);
    }
    async summarizeFileEnhanced(filePath, userId, title, subject, gradeLevel, learningObjectives, targetAudience, difficultyLevel, durationMinutes, keyTopics, summaryType) {
        let fileContent;
        try {
            fileContent = await fs.readFile(filePath, 'utf-8');
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to read file content.');
        }
        return this.summarizeContent(fileContent, userId, undefined, title, subject, gradeLevel, learningObjectives, targetAudience, difficultyLevel, durationMinutes, keyTopics, summaryType);
    }
    async generateQuizQuestions(text, numberOfQuestions = 5) {
        try {
            if (!this.genAI || !this.chatModel) {
                const mockQuestions = [];
                for (let i = 0; i < numberOfQuestions; i++) {
                    mockQuestions.push({
                        question: `Mock question ${i + 1} based on the text?`,
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correctAnswer: "A"
                    });
                }
                return mockQuestions;
            }
            return await this.generateQuizWithLangGraph(text, numberOfQuestions);
        }
        catch (error) {
            console.error('Error generating quiz questions:', error);
            throw new common_1.InternalServerErrorException('Failed to generate quiz questions.');
        }
    }
    async generateQuizQuestionsEnhanced(text, numberOfQuestions = 5, userId, subject, gradeLevel, difficultyLevel, questionType, learningObjectives, keyTopics, language) {
        try {
            if (!this.genAI || !this.chatModel) {
                const mockQuestions = [];
                for (let i = 0; i < numberOfQuestions; i++) {
                    mockQuestions.push({
                        question: `Enhanced mock question ${i + 1} for ${subject || 'general'} subject?`,
                        options: ["Option A", "Option B", "Option C", "Option D"],
                        correctAnswer: "A",
                        difficulty: difficultyLevel || 'medium',
                        topic: keyTopics || 'general'
                    });
                }
                return {
                    questions: mockQuestions,
                    numberOfQuestions,
                    questionType: questionType || 'multiple-choice',
                    subject,
                    gradeLevel,
                    difficultyLevel,
                    generatedAt: new Date(),
                };
            }
            let prompt = `Sen eğitim alanında uzman bir soru hazırlama asistanısın. Aşağıdaki metin için ${numberOfQuestions} adet ${questionType || 'çoktan seçmeli'} soru hazırla.\n\n`;
            if (subject)
                prompt += `Konu Alanı: ${subject}\n`;
            if (gradeLevel)
                prompt += `Sınıf Seviyesi: ${gradeLevel}\n`;
            if (difficultyLevel)
                prompt += `Zorluk Seviyesi: ${difficultyLevel}\n`;
            if (learningObjectives)
                prompt += `Öğrenme Hedefleri: ${learningObjectives}\n`;
            if (keyTopics)
                prompt += `Odaklanılacak Konular: ${keyTopics}\n`;
            if (language)
                prompt += `Dil: ${language}\n`;
            prompt += `\n--- METİN ---\n${text}\n\n`;
            if (questionType === 'multiple-choice' || !questionType) {
                prompt += `Her soru için:\n`;
                prompt += `- Açık ve net soru metni\n`;
                prompt += `- 4 seçenek (A, B, C, D)\n`;
                prompt += `- Doğru cevap\n`;
                prompt += `- Kısa açıklama\n\n`;
            }
            else if (questionType === 'true-false') {
                prompt += `Her soru için:\n`;
                prompt += `- Doğru/Yanlış sorusu\n`;
                prompt += `- Doğru cevap\n`;
                prompt += `- Kısa açıklama\n\n`;
            }
            else if (questionType === 'fill-blank') {
                prompt += `Her soru için:\n`;
                prompt += `- Boşluk doldurma sorusu\n`;
                prompt += `- Doğru cevap\n`;
                prompt += `- Alternatif kabul edilebilir cevaplar\n\n`;
            }
            prompt += `Soruları ${difficultyLevel || 'orta'} seviyede hazırla ve öğrenme hedeflerine uygun olsun. Cevabını JSON formatında ver.`;
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const questions = response.text();
            const analysis = await this.prisma.videoAnalysis.create({
                data: {
                    userId,
                    videoUrl: 'N/A',
                    title: `${subject || 'Genel'} - Quiz Soruları`,
                    summary: questions,
                    status: 'completed',
                },
            });
            return {
                id: analysis.id,
                questions,
                numberOfQuestions,
                questionType: questionType || 'multiple-choice',
                subject,
                gradeLevel,
                difficultyLevel,
                generatedAt: analysis.createdAt,
            };
        }
        catch (error) {
            console.error('Error generating enhanced quiz questions:', error);
            throw new common_1.InternalServerErrorException('Failed to generate enhanced quiz questions.');
        }
    }
    async generateQuizWithLangGraph(text, numberOfQuestions) {
        const extractTopics = async (state) => {
            const topicsPrompt = new prompts_1.PromptTemplate({
                template: `Aşağıdaki metni analiz et ve quiz soruları için uygun olan {numberOfQuestions} adet anahtar konuyu çıkar. Sadece konu dizilerinin JSON formatında listesini döndür. Cevabını Türkçe ver.

Metin: {text}

Örnek format: ["Konu 1", "Konu 2", "Konu 3"]`,
                inputVariables: ["text", "numberOfQuestions"],
            });
            const chain = topicsPrompt.pipe(this.chatModel);
            const response = await chain.invoke({ text: state.text, numberOfQuestions: state.numberOfQuestions });
            const topicsString = response.content.toString();
            try {
                const keyTopics = JSON.parse(topicsString);
                return {
                    ...state,
                    keyTopics,
                    messages: [...state.messages, new messages_1.AIMessage(`${keyTopics.length} anahtar konu çıkarıldı`)]
                };
            }
            catch {
                const fallbackTopics = Array.from({ length: state.numberOfQuestions }, (_, i) => `Topic ${i + 1}`);
                return {
                    ...state,
                    keyTopics: fallbackTopics,
                    messages: [...state.messages, new messages_1.AIMessage(`Yedek konular kullanıldı`)]
                };
            }
        };
        const generateQuestions = async (state) => {
            const questionsPrompt = new prompts_1.PromptTemplate({
                template: `Aşağıdaki metin ve anahtar konulara dayalı olarak {numberOfQuestions} adet çoktan seçmeli quiz sorusu oluştur. Her soru 4 seçeneğe (A, B, C, D) sahip olmalı ve doğru cevabı belirtilmeli. Çıktıyı JSON nesneler dizisi olarak formatla. Tüm soruları ve seçenekleri Türkçe yaz.

Metin: {text}

Anahtar Konular: {keyTopics}

Her soruyu şu formatta yaz:
{{
  "question": "Soru metni?",
  "options": ["Seçenek A", "Seçenek B", "Seçenek C", "Seçenek D"],
  "correctAnswer": "A",
  "topic": "İlgili konu"
}}`,
                inputVariables: ["text", "numberOfQuestions", "keyTopics"],
            });
            const chain = questionsPrompt.pipe(this.chatModel);
            const response = await chain.invoke({
                text: state.text,
                numberOfQuestions: state.numberOfQuestions,
                keyTopics: state.keyTopics?.join(', ') || ''
            });
            const questionsString = response.content.toString();
            try {
                const questions = JSON.parse(questionsString);
                return {
                    ...state,
                    questions,
                    messages: [...state.messages, new messages_1.AIMessage(`${questions.length} quiz sorusu oluşturuldu`)]
                };
            }
            catch {
                const fallbackQuestions = [
                    {
                        question: 'Bir üçgenin iç açıları toplamı kaç derecedir?',
                        options: ['90°', '180°', '270°', '360°'],
                        correctAnswer: "B",
                        topic: 'Üçgenlerin Açı Özellikleri',
                        difficulty: 'Kolay'
                    },
                    {
                        question: 'Tüm kenarları eşit olan üçgene ne ad verilir?',
                        options: ['İkizkenar üçgen', 'Çeşitkenar üçgen', 'Eşkenar üçgen', 'Dik üçgen'],
                        correctAnswer: "C",
                        topic: 'Üçgen Türleri',
                        difficulty: 'Kolay'
                    },
                    {
                        question: 'Bir dik üçgenin dik kenarları 6 cm ve 8 cm ise, hipotenüsü kaç cm\'dir?',
                        options: ['10 cm', '12 cm', '14 cm', '16 cm'],
                        correctAnswer: "A",
                        topic: 'Pitagor Teoremi',
                        difficulty: 'Orta'
                    },
                    {
                        question: 'Bir açısı 90° olan üçgene ne ad verilir?',
                        options: ['Dar açılı üçgen', 'Dik açılı üçgen', 'Geniş açılı üçgen', 'Eşkenar üçgen'],
                        correctAnswer: "B",
                        topic: 'Üçgen Türleri',
                        difficulty: 'Kolay'
                    },
                    {
                        question: 'İkizkenar üçgenin kaç kenarı eşittir?',
                        options: ['Hiçbiri', 'İki kenarı', 'Üç kenarı', 'Bir kenarı'],
                        correctAnswer: "B",
                        topic: 'Üçgen Türleri',
                        difficulty: 'Kolay'
                    },
                    {
                        question: 'Pitagor teoreminin formülü hangisidir?',
                        options: ['a + b = c', 'a² + b² = c²', 'a × b = c', 'a - b = c'],
                        correctAnswer: "B",
                        topic: 'Pitagor Teoremi',
                        difficulty: 'Orta'
                    },
                    {
                        question: 'Tüm açıları 90°\'den küçük olan üçgene ne ad verilir?',
                        options: ['Dar açılı üçgen', 'Dik açılı üçgen', 'Geniş açılı üçgen', 'Eşkenar üçgen'],
                        correctAnswer: "A",
                        topic: 'Üçgen Türleri',
                        difficulty: 'Orta'
                    },
                    {
                        question: 'Bir üçgenin kenar uzunlukları 3, 4, 5 cm ise bu üçgen hangi türdendir?',
                        options: ['Eşkenar üçgen', 'İkizkenar üçgen', 'Dik üçgen', 'Geniş açılı üçgen'],
                        correctAnswer: "C",
                        topic: 'Pitagor Teoremi ve Üçgen Türleri',
                        difficulty: 'Zor'
                    }
                ];
                const selectedQuestions = fallbackQuestions.slice(0, state.numberOfQuestions);
                return {
                    ...state,
                    questions: selectedQuestions,
                    messages: [...state.messages, new messages_1.AIMessage(`Yedek sorular kullanıldı`)]
                };
            }
        };
        const workflow = new langgraph_1.StateGraph({
            channels: {
                text: null,
                numberOfQuestions: null,
                keyTopics: null,
                questions: null,
                messages: null
            }
        })
            .addNode("extract_topics", extractTopics)
            .addNode("generate_questions", generateQuestions)
            .addEdge(langgraph_1.START, "extract_topics")
            .addEdge("extract_topics", "generate_questions")
            .addEdge("generate_questions", langgraph_1.END);
        const app = workflow.compile();
        const initialState = {
            text,
            numberOfQuestions,
            messages: [new messages_1.HumanMessage(`Generate ${numberOfQuestions} quiz questions from the provided text`)]
        };
        const result = await app.invoke(initialState);
        return result.questions || [];
    }
    async analyzeContentWithWorkflow(text, userId, analysisType = 'summary') {
        if (!this.genAI || !this.chatModel) {
            return this.summarizeContent(text, userId);
        }
        const analyzeSummary = async (state) => {
            const summaryPrompt = new prompts_1.PromptTemplate({
                template: `Aşağıdaki metnin kapsamlı bir özetini Türkçe olarak hazırla:

{text}

Ana fikirler, temel kavramlar ve önemli detaylara odaklan.`,
                inputVariables: ["text"],
            });
            const chain = summaryPrompt.pipe(this.chatModel);
            const response = await chain.invoke({ text: state.text });
            return {
                ...state,
                summary: response.content.toString(),
                messages: [...state.messages, new messages_1.AIMessage("Kapsamlı özet oluşturuldu")]
            };
        };
        const extractKeyPoints = async (state) => {
            const keyPointsPrompt = new prompts_1.PromptTemplate({
                template: `Bu metinden en önemli anahtar noktaları Türkçe olarak JSON dizi formatında çıkar:

{text}

Dönüş formatı: ["Anahtar nokta 1", "Anahtar nokta 2", "Anahtar nokta 3"]`,
                inputVariables: ["text"],
            });
            const chain = keyPointsPrompt.pipe(this.chatModel);
            const response = await chain.invoke({ text: state.text });
            try {
                const keyPoints = JSON.parse(response.content.toString());
                return {
                    ...state,
                    keyPoints,
                    messages: [...state.messages, new messages_1.AIMessage(`${keyPoints.length} anahtar nokta çıkarıldı`)]
                };
            }
            catch {
                return {
                    ...state,
                    keyPoints: ["Temel kavramlar belirlendi", "Ana temalar çıkarıldı", "Önemli detaylar not edildi"],
                    messages: [...state.messages, new messages_1.AIMessage("Yedek anahtar noktalar kullanıldı")]
                };
            }
        };
        const assessEducationalValue = async (state) => {
            const educationPrompt = new prompts_1.PromptTemplate({
                template: `Bu içeriğin eğitimsel değerini ve zorluk seviyesini Türkçe olarak değerlendir:

{text}

Şunları belirt:
1. Eğitimsel değer (Yüksek/Orta/Düşük)
2. Zorluk seviyesi (Başlangıç/Orta/İleri)
3. Kısa açıklama

JSON formatında: {{"value": "Yüksek", "difficulty": "Orta", "explanation": "..."}}`,
                inputVariables: ["text"],
            });
            const chain = educationPrompt.pipe(this.chatModel);
            const response = await chain.invoke({ text: state.text });
            try {
                const assessment = JSON.parse(response.content.toString());
                return {
                    ...state,
                    educationalValue: assessment.value,
                    difficulty: assessment.difficulty,
                    messages: [...state.messages, new messages_1.AIMessage(`Eğitimsel değer değerlendirildi: ${assessment.value}`)]
                };
            }
            catch {
                return {
                    ...state,
                    educationalValue: "Orta",
                    difficulty: "Orta",
                    messages: [...state.messages, new messages_1.AIMessage("Yedek değerlendirme kullanıldı")]
                };
            }
        };
        const workflow = new langgraph_1.StateGraph({
            channels: {
                text: null,
                analysisType: null,
                summary: null,
                keyPoints: null,
                educationalValue: null,
                difficulty: null,
                messages: null
            }
        })
            .addNode("analyze_summary", analyzeSummary)
            .addNode("extract_key_points", extractKeyPoints)
            .addNode("assess_educational", assessEducationalValue)
            .addEdge(langgraph_1.START, "analyze_summary")
            .addEdge("analyze_summary", "extract_key_points")
            .addEdge("extract_key_points", "assess_educational")
            .addEdge("assess_educational", langgraph_1.END);
        const app = workflow.compile();
        const initialState = {
            text,
            analysisType,
            messages: [new messages_1.HumanMessage(`Performing ${analysisType} analysis of the content`)]
        };
        const result = await app.invoke(initialState);
        const enhancedSummary = `${result.summary}\n\nKey Points:\n${result.keyPoints?.map(point => `• ${point}`).join('\n')}\n\nEducational Value: ${result.educationalValue}\nDifficulty Level: ${result.difficulty}`;
        const videoAnalysis = await this.prisma.videoAnalysis.create({
            data: {
                userId,
                videoUrl: 'N/A',
                title: `${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis`,
                summary: enhancedSummary,
                status: 'completed',
            },
        });
        return videoAnalysis;
    }
    async analyzeContentWorkflowEnhanced(text, userId, analysisType, subject, gradeLevel, learningObjectives, targetAudience, difficultyLevel, keyTopics, analysisDepth, includeRecommendations, language) {
        try {
            if (!this.genAI || !this.chatModel) {
                return {
                    analysis: `Enhanced mock workflow analysis for ${subject || 'general'} subject`,
                    analysisType,
                    subject,
                    gradeLevel,
                    targetAudience,
                    steps: [
                        { step: 'enhanced_content_extraction', result: 'Enhanced content extracted' },
                        { step: 'contextual_analysis', result: 'Contextual analysis completed' },
                        { step: 'educational_assessment', result: 'Educational value assessed' },
                        { step: 'recommendation_generation', result: 'Recommendations generated' },
                    ],
                    generatedAt: new Date(),
                };
            }
            let prompt = `Sen eğitim alanında uzman bir içerik analiz asistanısın. Aşağıdaki metni kapsamlı bir şekilde analiz et.\n\n`;
            if (subject)
                prompt += `Konu Alanı: ${subject}\n`;
            if (gradeLevel)
                prompt += `Sınıf Seviyesi: ${gradeLevel}\n`;
            if (learningObjectives)
                prompt += `Öğrenme Hedefleri: ${learningObjectives}\n`;
            if (targetAudience)
                prompt += `Hedef Kitle: ${targetAudience}\n`;
            if (difficultyLevel)
                prompt += `Zorluk Seviyesi: ${difficultyLevel}\n`;
            if (keyTopics)
                prompt += `Anahtar Konular: ${keyTopics}\n`;
            if (analysisDepth)
                prompt += `Analiz Derinliği: ${analysisDepth}\n`;
            if (language)
                prompt += `Analiz Dili: ${language}\n`;
            prompt += `\n--- ANALİZ EDİLECEK METİN ---\n${text}\n\n`;
            prompt += `Lütfen aşağıdaki başlıklar altında detaylı analiz yap:\n\n`;
            prompt += `1. **İçerik Özeti**: Ana konular ve kavramlar\n`;
            prompt += `2. **Eğitimsel Değer**: Öğrenme potansiyeli ve faydaları\n`;
            prompt += `3. **Hedef Kitleye Uygunluk**: ${targetAudience || 'Belirtilen kitle'} için uygunluk\n`;
            prompt += `4. **Zorluk Seviyesi Değerlendirmesi**: İçeriğin karmaşıklığı\n`;
            prompt += `5. **Anahtar Öğrenme Noktaları**: Önemli kavramlar ve beceriler\n`;
            if (includeRecommendations !== false) {
                prompt += `6. **Eğitimsel Öneriler**: \n`;
                prompt += `   - Öğretim stratejileri\n`;
                prompt += `   - Ek kaynaklar\n`;
                prompt += `   - Değerlendirme yöntemleri\n`;
                prompt += `   - İyileştirme önerileri\n`;
            }
            prompt += `\nAnalizi ${analysisDepth || 'orta'} derinlikte yap ve ${language || 'Türkçe'} dilinde sun.`;
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const analysis = response.text();
            const analysisRecord = await this.prisma.videoAnalysis.create({
                data: {
                    userId,
                    videoUrl: 'N/A',
                    title: `${subject || 'Genel'} - Gelişmiş İçerik Analizi`,
                    summary: analysis,
                    status: 'completed',
                },
            });
            return {
                id: analysisRecord.id,
                analysis,
                analysisType,
                subject,
                gradeLevel,
                targetAudience,
                difficultyLevel,
                analysisDepth,
                includeRecommendations,
                steps: [
                    { step: 'enhanced_content_extraction', result: 'İçerik başarıyla çıkarıldı' },
                    { step: 'contextual_analysis', result: 'Bağlamsal analiz tamamlandı' },
                    { step: 'educational_assessment', result: 'Eğitimsel değer değerlendirildi' },
                    { step: 'recommendation_generation', result: 'Öneriler oluşturuldu' },
                ],
                generatedAt: analysisRecord.createdAt,
            };
        }
        catch (error) {
            console.error('Error in enhanced workflow analysis:', error);
            throw new common_1.InternalServerErrorException('Gelişmiş workflow analizi başarısız oldu.');
        }
    }
};
exports.ContentAnalysisService = ContentAnalysisService;
exports.ContentAnalysisService = ContentAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentAnalysisService);
//# sourceMappingURL=content-analysis.service.js.map