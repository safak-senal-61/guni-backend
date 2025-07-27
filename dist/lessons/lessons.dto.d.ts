import { ContentType } from '@prisma/client';
export declare class CreateLessonDto {
    title: string;
    description?: string;
    subject: string;
    topic?: string;
    difficulty: string;
    type: ContentType;
    duration?: number;
    thumbnail?: string;
    tags?: string[];
    prerequisites?: string[];
    learningObjectives?: string[];
}
declare const UpdateLessonDto_base: import("@nestjs/common").Type<Partial<CreateLessonDto>>;
export declare class UpdateLessonDto extends UpdateLessonDto_base {
}
export {};
