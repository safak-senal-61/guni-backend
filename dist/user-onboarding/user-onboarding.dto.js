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
exports.PersonalizedHomepageDto = exports.SubmitOnboardingQuizDto = exports.OnboardingQuizAnswerDto = exports.OnboardingQuizDto = exports.UpdateUserProfileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class UpdateUserProfileDto {
    age;
    gender;
    gradeLevel;
    learningStyle;
    interests;
    goals;
    studyHours;
    difficultyPreference;
    weakSubjects;
}
exports.UpdateUserProfileDto = UpdateUserProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'User age' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], UpdateUserProfileDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.Gender, description: 'User gender' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.Gender),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.GradeLevel, description: 'User grade level' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.GradeLevel),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "gradeLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.LearningStyle, description: 'Preferred learning style' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.LearningStyle),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "learningStyle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'User interests' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateUserProfileDto.prototype, "interests", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Learning goals' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateUserProfileDto.prototype, "goals", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Preferred daily study hours' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], UpdateUserProfileDto.prototype, "studyHours", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Difficulty preference' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "difficultyPreference", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'Known weak subjects' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateUserProfileDto.prototype, "weakSubjects", void 0);
class OnboardingQuizDto {
    subjects;
    questionsPerSubject = 5;
}
exports.OnboardingQuizDto = OnboardingQuizDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], description: 'Subjects to assess' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], OnboardingQuizDto.prototype, "subjects", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of questions per subject' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(3),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], OnboardingQuizDto.prototype, "questionsPerSubject", void 0);
class OnboardingQuizAnswerDto {
    questionId;
    answer;
    subject;
}
exports.OnboardingQuizAnswerDto = OnboardingQuizAnswerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quiz question ID' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingQuizAnswerDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User answer' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingQuizAnswerDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subject of the question' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingQuizAnswerDto.prototype, "subject", void 0);
class SubmitOnboardingQuizDto {
    answers;
}
exports.SubmitOnboardingQuizDto = SubmitOnboardingQuizDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OnboardingQuizAnswerDto], description: 'Quiz answers' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    __metadata("design:type", Array)
], SubmitOnboardingQuizDto.prototype, "answers", void 0);
class PersonalizedHomepageDto {
    lessonCount = 10;
    includeQuizzes = true;
    includeProgress = true;
}
exports.PersonalizedHomepageDto = PersonalizedHomepageDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of recommended lessons' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(20),
    __metadata("design:type", Number)
], PersonalizedHomepageDto.prototype, "lessonCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include quiz recommendations' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PersonalizedHomepageDto.prototype, "includeQuizzes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Include progress analytics' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], PersonalizedHomepageDto.prototype, "includeProgress", void 0);
//# sourceMappingURL=user-onboarding.dto.js.map