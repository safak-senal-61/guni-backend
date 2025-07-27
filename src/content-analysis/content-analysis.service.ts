import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StateGraph, END, START } from '@langchain/langgraph';
import { BaseMessage, HumanMessage, AIMessage } from '@langchain/core/messages';

@Injectable()
export class ContentAnalysisService {
  private genAI: GoogleGenerativeAI;
  private chatModel: ChatGoogleGenerativeAI;

  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.GOOGLE_API_KEY;
    // Force mock responses in test environment
    if (!apiKey || process.env.NODE_ENV === 'test') {
      console.warn('Google API Key is not configured or in test environment. Using mock responses for testing.');
      return;
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.chatModel = new ChatGoogleGenerativeAI({
      apiKey: apiKey,
      model: 'gemini-2.0-flash-exp',
      temperature: 0.7,
    });
  }

  async summarizeContent(text: string, userId: string, videoUrl?: string, title?: string) {
    let summary: string;
    
    if (!this.genAI) {
      // Mock response for testing when API key is not available
      summary = `Mock summary of the provided text: ${text.substring(0, 100)}... This is a test summary generated for testing purposes.`;
    } else {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
      const prompt = `Summarize the following content:\n\n${text}\n\nProvide a concise summary, key points, and potential topics.`;
      
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        summary = response.text();
      } catch (error) {
        console.error('Error generating content summary:', error);
        throw new InternalServerErrorException('Failed to summarize content using AI.');
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

  async summarizeFile(filePath: string, userId: string, title?: string) {
    let fileContent: string;
    try {
      fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new InternalServerErrorException('Failed to read file content.');
    }

    return this.summarizeContent(fileContent, userId, undefined, title);
  }

  async generateQuizQuestions(text: string, numberOfQuestions: number = 5) {
    try {
      if (!this.genAI || !this.chatModel) {
        // Mock response for testing when API key is not available
        const mockQuestions: any[] = [];
        for (let i = 0; i < numberOfQuestions; i++) {
          mockQuestions.push({
            question: `Mock question ${i + 1} based on the text?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: "A"
          });
        }
        return mockQuestions;
      }

      // Use LangGraph for advanced quiz generation workflow
      return await this.generateQuizWithLangGraph(text, numberOfQuestions);
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      throw new InternalServerErrorException('Failed to generate quiz questions.');
    }
  }

  private async generateQuizWithLangGraph(text: string, numberOfQuestions: number) {
    // Define the state interface for our workflow
    interface WorkflowState {
      text: string;
      numberOfQuestions: number;
      keyTopics?: string[];
      questions?: any[];
      messages: BaseMessage[];
    }

    // Step 1: Extract key topics from the text
    const extractTopics = async (state: WorkflowState) => {
      const topicsPrompt = new PromptTemplate({
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
          messages: [...state.messages, new AIMessage(`Extracted ${keyTopics.length} key topics`)]
        };
      } catch {
        // Fallback if JSON parsing fails
        const fallbackTopics = Array.from({ length: state.numberOfQuestions }, (_, i) => `Topic ${i + 1}`);
        return {
          ...state,
          keyTopics: fallbackTopics,
          messages: [...state.messages, new AIMessage(`Used fallback topics`)]
        };
      }
    };

    // Step 2: Generate questions based on extracted topics
    const generateQuestions = async (state: WorkflowState) => {
      const questionsPrompt = new PromptTemplate({
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
          messages: [...state.messages, new AIMessage(`Generated ${questions.length} quiz questions`)]
        };
      } catch {
        // Fallback questions if JSON parsing fails
        const fallbackQuestions = Array.from({ length: state.numberOfQuestions }, (_, i) => ({
          question: `Question ${i + 1} based on the content?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: "A",
          topic: state.keyTopics?.[i] || `Topic ${i + 1}`
        }));
        return {
          ...state,
          questions: fallbackQuestions,
          messages: [...state.messages, new AIMessage(`Used fallback questions`)]
        };
      }
    };

    // Create the workflow graph
    const workflow = new StateGraph<WorkflowState>({
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
      .addEdge(START, "extract_topics")
      .addEdge("extract_topics", "generate_questions")
      .addEdge("generate_questions", END);

    // Compile and run the workflow
    const app = workflow.compile();
    
    const initialState: WorkflowState = {
      text,
      numberOfQuestions,
      messages: [new HumanMessage(`Generate ${numberOfQuestions} quiz questions from the provided text`)]
    };

    const result = await app.invoke(initialState);
    return result.questions || [];
  }

  // Advanced content analysis using LangGraph
  async analyzeContentWithWorkflow(text: string, userId: string, analysisType: 'summary' | 'detailed' | 'educational' = 'summary') {
    if (!this.genAI || !this.chatModel) {
      return this.summarizeContent(text, userId);
    }

    interface AnalysisState {
      text: string;
      analysisType: string;
      summary?: string;
      keyPoints?: string[];
      educationalValue?: string;
      difficulty?: string;
      messages: BaseMessage[];
    }

    // Analysis steps
    const analyzeSummary = async (state: AnalysisState) => {
      const summaryPrompt = new PromptTemplate({
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
        messages: [...state.messages, new AIMessage("Generated comprehensive summary")]
      };
    };

    const extractKeyPoints = async (state: AnalysisState) => {
      const keyPointsPrompt = new PromptTemplate({
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
          messages: [...state.messages, new AIMessage(`Extracted ${keyPoints.length} key points`)]
        };
      } catch {
        return {
          ...state,
          keyPoints: ["Key concepts identified", "Main themes extracted", "Important details noted"],
          messages: [...state.messages, new AIMessage("Used fallback key points")]
        };
      }
    };

    const assessEducationalValue = async (state: AnalysisState) => {
      const educationPrompt = new PromptTemplate({
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
          messages: [...state.messages, new AIMessage(`Assessed educational value: ${assessment.value}`)]
        };
      } catch {
        return {
          ...state,
          educationalValue: "Medium",
          difficulty: "Intermediate",
          messages: [...state.messages, new AIMessage("Used fallback assessment")]
        };
      }
    };

    // Create workflow based on analysis type
    const workflow = new StateGraph<AnalysisState>({
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
      .addEdge(START, "analyze_summary")
      .addEdge("analyze_summary", "extract_key_points")
      .addEdge("extract_key_points", "assess_educational")
      .addEdge("assess_educational", END);

    const app = workflow.compile();
    
    const initialState: AnalysisState = {
      text,
      analysisType,
      messages: [new HumanMessage(`Performing ${analysisType} analysis of the content`)]
    };

    const result = await app.invoke(initialState);
    
    // Save to database with enhanced analysis
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
}

