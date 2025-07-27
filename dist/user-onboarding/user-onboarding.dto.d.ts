import { Gender, GradeLevel, LearningStyle } from '@prisma/client';
export declare class UpdateUserProfileDto {
    age?: number;
    gender?: Gender;
    gradeLevel?: GradeLevel;
    learningStyle?: LearningStyle;
    interests?: string[];
    goals?: string[];
    studyHours?: number;
    difficultyPreference?: string;
    weakSubjects?: string[];
}
export declare class OnboardingQuizDto {
    subjects: string[];
    questionsPerSubject?: number;
}
export declare class OnboardingQuizAnswerDto {
    questionId: string;
    answer: string;
    subject: string;
}
export declare class SubmitOnboardingQuizDto {
    answers: OnboardingQuizAnswerDto[];
}
export declare class PersonalizedHomepageDto {
    lessonCount?: number;
    includeQuizzes?: boolean;
    includeProgress?: boolean;
}
