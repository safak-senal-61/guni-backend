import { QuizType } from '@prisma/client';
export declare class CreateQuizDto {
    lessonId?: string;
    title: string;
    description?: string;
    subject: string;
    topic?: string;
    difficulty: string;
    quizType: QuizType;
    questionCount: number;
    passingScore: number;
    questions: any;
}
declare const UpdateQuizDto_base: import("@nestjs/common").Type<Partial<CreateQuizDto>>;
export declare class UpdateQuizDto extends UpdateQuizDto_base {
}
export {};
