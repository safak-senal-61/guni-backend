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
    async summarizeContent(text, userId, videoUrl, title) {
        let summary;
        if (!this.genAI) {
            summary = `Mock summary of the provided text: ${text.substring(0, 100)}... This is a test summary generated for testing purposes.`;
        }
        else {
            const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
            const prompt = `Summarize the following content:\n\n${text}\n\nProvide a concise summary, key points, and potential topics.`;
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
    async generateQuizWithLangGraph(text, numberOfQuestions) {
        const extractTopics = async (state) => {
            const topicsPrompt = new prompts_1.PromptTemplate({
                template: `Analyze the following text and extract {numberOfQuestions} key topics that would be suitable for quiz questions. Return only a JSON array of topic strings.

Text: {text}

Example format: ["Topic 1", "Topic 2", "Topic 3"]`,
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
                    messages: [...state.messages, new messages_1.AIMessage(`Extracted ${keyTopics.length} key topics`)]
                };
            }
            catch {
                const fallbackTopics = Array.from({ length: state.numberOfQuestions }, (_, i) => `Topic ${i + 1}`);
                return {
                    ...state,
                    keyTopics: fallbackTopics,
                    messages: [...state.messages, new messages_1.AIMessage(`Used fallback topics`)]
                };
            }
        };
        const generateQuestions = async (state) => {
            const questionsPrompt = new prompts_1.PromptTemplate({
                template: `Generate {numberOfQuestions} multiple-choice quiz questions based on the following text and key topics. Each question should have 4 options (A, B, C, D) and indicate the correct answer. Format the output as a JSON array of objects.

Text: {text}

Key Topics: {keyTopics}

Format each question as:
{{
  "question": "Question text?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "A",
  "topic": "Related topic"
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
                    messages: [...state.messages, new messages_1.AIMessage(`Generated ${questions.length} quiz questions`)]
                };
            }
            catch {
                const fallbackQuestions = Array.from({ length: state.numberOfQuestions }, (_, i) => ({
                    question: `Question ${i + 1} based on the content?`,
                    options: ["Option A", "Option B", "Option C", "Option D"],
                    correctAnswer: "A",
                    topic: state.keyTopics?.[i] || `Topic ${i + 1}`
                }));
                return {
                    ...state,
                    questions: fallbackQuestions,
                    messages: [...state.messages, new messages_1.AIMessage(`Used fallback questions`)]
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
                template: `Provide a comprehensive summary of the following text:

{text}

Focus on main ideas, key concepts, and important details.`,
                inputVariables: ["text"],
            });
            const chain = summaryPrompt.pipe(this.chatModel);
            const response = await chain.invoke({ text: state.text });
            return {
                ...state,
                summary: response.content.toString(),
                messages: [...state.messages, new messages_1.AIMessage("Generated comprehensive summary")]
            };
        };
        const extractKeyPoints = async (state) => {
            const keyPointsPrompt = new prompts_1.PromptTemplate({
                template: `Extract the most important key points from this text as a JSON array of strings:

{text}

Return format: ["Key point 1", "Key point 2", "Key point 3"]`,
                inputVariables: ["text"],
            });
            const chain = keyPointsPrompt.pipe(this.chatModel);
            const response = await chain.invoke({ text: state.text });
            try {
                const keyPoints = JSON.parse(response.content.toString());
                return {
                    ...state,
                    keyPoints,
                    messages: [...state.messages, new messages_1.AIMessage(`Extracted ${keyPoints.length} key points`)]
                };
            }
            catch {
                return {
                    ...state,
                    keyPoints: ["Key concepts identified", "Main themes extracted", "Important details noted"],
                    messages: [...state.messages, new messages_1.AIMessage("Used fallback key points")]
                };
            }
        };
        const assessEducationalValue = async (state) => {
            const educationPrompt = new prompts_1.PromptTemplate({
                template: `Assess the educational value and difficulty level of this content:

{text}

Provide:
1. Educational value (High/Medium/Low)
2. Difficulty level (Beginner/Intermediate/Advanced)
3. Brief explanation

Format as JSON: {{"value": "High", "difficulty": "Intermediate", "explanation": "..."}}`,
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
                    messages: [...state.messages, new messages_1.AIMessage(`Assessed educational value: ${assessment.value}`)]
                };
            }
            catch {
                return {
                    ...state,
                    educationalValue: "Medium",
                    difficulty: "Intermediate",
                    messages: [...state.messages, new messages_1.AIMessage("Used fallback assessment")]
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
};
exports.ContentAnalysisService = ContentAnalysisService;
exports.ContentAnalysisService = ContentAnalysisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContentAnalysisService);
//# sourceMappingURL=content-analysis.service.js.map