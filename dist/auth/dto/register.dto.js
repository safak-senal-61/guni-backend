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
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RegisterDto {
    email;
    password;
    firstName;
    lastName;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'E-posta adresi',
        example: 'user@example.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Geçerli bir e-posta adresi giriniz' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'E-posta adresi boş olamaz' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Şifre',
        example: 'Sifre123!',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)({ message: 'Şifre bir metin olmalıdır' }),
    (0, class_validator_1.MinLength)(6, { message: 'Şifre en az 6 karakter olmalıdır' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Şifre boş olamaz' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ad',
        example: 'Ahmet',
    }),
    (0, class_validator_1.IsString)({ message: 'Ad bir metin olmalıdır' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Ad boş olamaz' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Soyad',
        example: 'Yılmaz',
    }),
    (0, class_validator_1.IsString)({ message: 'Soyad bir metin olmalıdır' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Soyad boş olamaz' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "lastName", void 0);
//# sourceMappingURL=register.dto.js.map