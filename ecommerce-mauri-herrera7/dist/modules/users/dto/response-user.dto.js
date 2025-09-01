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
exports.CreateAndUpdateUserResponseDTO = exports.UserResponseDTO = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UserResponseDTO {
    id;
    name;
    email;
    phone;
    country;
    city;
    address;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String, format: "email" }, phone: { required: true, type: () => Number }, country: { required: false, type: () => String }, city: { required: false, type: () => String }, address: { required: true, type: () => String } };
    }
}
exports.UserResponseDTO = UserResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab' }),
    (0, class_validator_1.IsString)({ message: 'The ID must be an string.' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan Pérez' }),
    (0, class_validator_1.IsString)({ message: 'The Name must be an string.' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'juan@example.com' }),
    (0, class_validator_1.IsEmail)({}, { message: 'The email, must havea valid format.' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1122334455 }),
    (0, class_validator_1.IsNumber)({}, { message: 'The phone must be a number.' }),
    __metadata("design:type", Number)
], UserResponseDTO.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Argentina' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Thhe country must be a string.' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Buenos Aires' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'The city must be a string' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Calle Falsa 123' }),
    (0, class_validator_1.IsString)({ message: 'The address must be an string.' }),
    __metadata("design:type", String)
], UserResponseDTO.prototype, "address", void 0);
class CreateAndUpdateUserResponseDTO {
    success;
    data;
    static _OPENAPI_METADATA_FACTORY() {
        return { success: { required: true, type: () => String }, data: { required: true, type: () => require("./response-user.dto").UserResponseDTO } };
    }
}
exports.CreateAndUpdateUserResponseDTO = CreateAndUpdateUserResponseDTO;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'User created succesfully' }),
    __metadata("design:type", String)
], CreateAndUpdateUserResponseDTO.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: () => UserResponseDTO }),
    __metadata("design:type", UserResponseDTO)
], CreateAndUpdateUserResponseDTO.prototype, "data", void 0);
//# sourceMappingURL=response-user.dto.js.map