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
exports.UpdateAchievementDto = exports.CreateAchievementDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
class CreateAchievementDto {
    title;
    description;
    category;
    points;
    icon;
    requirement;
}
exports.CreateAchievementDto = CreateAchievementDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the achievement',
        example: 'Quiz Master'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAchievementDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the achievement',
        example: 'Complete 10 quizzes with 80% or higher score'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAchievementDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category of the achievement',
        enum: client_1.AchievementCategory
    }),
    (0, class_validator_1.IsEnum)(client_1.AchievementCategory),
    __metadata("design:type", String)
], CreateAchievementDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Points awarded for this achievement',
        example: 100,
        minimum: 1
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAchievementDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Icon identifier for the achievement',
        example: 'trophy-icon'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAchievementDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Requirement value to unlock this achievement',
        example: 10,
        minimum: 1
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateAchievementDto.prototype, "requirement", void 0);
class UpdateAchievementDto {
    title;
    description;
    category;
    points;
    icon;
    requirement;
    isActive;
}
exports.UpdateAchievementDto = UpdateAchievementDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Title of the achievement',
        example: 'Quiz Master'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAchievementDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Description of the achievement',
        example: 'Complete 10 quizzes with 80% or higher score'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAchievementDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Category of the achievement',
        enum: client_1.AchievementCategory
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.AchievementCategory),
    __metadata("design:type", String)
], UpdateAchievementDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Points awarded for this achievement',
        example: 100,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateAchievementDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Icon identifier for the achievement',
        example: 'trophy-icon'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAchievementDto.prototype, "icon", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requirement value to unlock this achievement',
        example: 10,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateAchievementDto.prototype, "requirement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the achievement is active',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAchievementDto.prototype, "isActive", void 0);
//# sourceMappingURL=achievements.dto.js.map