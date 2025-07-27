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
exports.UpdateQuizDto = exports.CreateQuizDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateQuizDto {
    lessonId;
    title;
    description;
    subject;
    topic;
    difficulty;
    quizType;
    questionCount;
    passingScore;
    questions;
}
exports.CreateQuizDto = CreateQuizDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the lesson this quiz belongs to (optional)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "lessonId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Title of the quiz' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Description of the quiz', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subject of the quiz' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Topic of the quiz', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "topic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Difficulty level of the quiz' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.QuizType, description: 'Type of quiz (e.g., MULTIPLE_CHOICE, OPEN_ENDED)' }),
    (0, class_validator_1.IsEnum)(client_1.QuizType),
    __metadata("design:type", String)
], CreateQuizDto.prototype, "quizType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of questions in the quiz' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateQuizDto.prototype, "questionCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Passing score for the quiz (percentage)' }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], CreateQuizDto.prototype, "passingScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'JSON array of question objects' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateQuizDto.prototype, "questions", void 0);
class UpdateQuizDto extends (0, swagger_1.PartialType)(CreateQuizDto) {
}
exports.UpdateQuizDto = UpdateQuizDto;
//# sourceMappingURL=quizzes.dto.js.map