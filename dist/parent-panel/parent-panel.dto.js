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
exports.GetStudentDetailedProgressDto = exports.MarkNotificationReadDto = exports.SendNotificationDto = exports.GetProgressSummaryDto = exports.ApproveConnectionDto = exports.ConnectStudentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ConnectStudentDto {
    studentEmail;
    inviteCode;
}
exports.ConnectStudentDto = ConnectStudentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Öğrencinin email adresi',
        example: 'student@example.com'
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ConnectStudentDto.prototype, "studentEmail", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bağlantı için özel davet kodu',
        example: 'ABC123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConnectStudentDto.prototype, "inviteCode", void 0);
class ApproveConnectionDto {
    connectionId;
    status;
}
exports.ApproveConnectionDto = ApproveConnectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bağlantı ID\'si',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ApproveConnectionDto.prototype, "connectionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bağlantı durumu',
        example: 'approved',
        enum: ['approved', 'rejected']
    }),
    (0, class_validator_1.IsEnum)(['approved', 'rejected']),
    __metadata("design:type", String)
], ApproveConnectionDto.prototype, "status", void 0);
class GetProgressSummaryDto {
    studentId;
    startDate;
    endDate;
}
exports.GetProgressSummaryDto = GetProgressSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Öğrenci ID\'si',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetProgressSummaryDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Başlangıç tarihi (ISO format)',
        example: '2024-01-01T00:00:00.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetProgressSummaryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Bitiş tarihi (ISO format)',
        example: '2024-01-07T23:59:59.999Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GetProgressSummaryDto.prototype, "endDate", void 0);
class SendNotificationDto {
    receiverId;
    title;
    message;
    type;
    data;
}
exports.SendNotificationDto = SendNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Alıcı ID\'si',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "receiverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bildirim başlığı',
        example: 'Tebrikler!'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bildirim mesajı',
        example: 'Matematik quizinde harika bir performans sergiledi!'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bildirim tipi',
        example: 'achievement',
        enum: ['achievement', 'progress', 'quiz_completed', 'lesson_completed', 'parent_request', 'encouragement']
    }),
    (0, class_validator_1.IsEnum)(['achievement', 'progress', 'quiz_completed', 'lesson_completed', 'parent_request', 'encouragement']),
    __metadata("design:type", String)
], SendNotificationDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Ek veri (JSON format)',
        example: { quizScore: 95, subject: 'Mathematics' }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], SendNotificationDto.prototype, "data", void 0);
class MarkNotificationReadDto {
    notificationId;
}
exports.MarkNotificationReadDto = MarkNotificationReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bildirim ID\'si',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MarkNotificationReadDto.prototype, "notificationId", void 0);
class GetStudentDetailedProgressDto {
    studentId;
    subject;
    page;
    limit;
}
exports.GetStudentDetailedProgressDto = GetStudentDetailedProgressDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Öğrenci ID\'si',
        example: 'uuid-string'
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetStudentDetailedProgressDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Konu filtresi',
        example: 'Mathematics'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetStudentDetailedProgressDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sayfa numarası',
        example: 1
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetStudentDetailedProgressDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sayfa başına kayıt sayısı',
        example: 10
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetStudentDetailedProgressDto.prototype, "limit", void 0);
//# sourceMappingURL=parent-panel.dto.js.map