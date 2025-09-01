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
exports.LoginDto = exports.CreateUserDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const MatchPassword_1 = require("../../../helpers/MatchPassword");
class CreateUserDto {
    email;
    name;
    password;
    confirmPassword;
    address;
    phone;
    country;
    city;
    isAdmin;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String, description: "@description Esta propiedad debe ser el email del usuario", example: "Superman@gmail.com", format: "email" }, name: { required: true, type: () => String, description: "Debe ser un string con al menos 3 caracteres y no puede estar vac\u00EDo", example: "ClarKent", minLength: 3 }, password: { required: true, type: () => String, description: "Debe ser un string con al menos una letra may\u00FAscula, una min\u00FAscula, un n\u00FAmero y un caracter especial", example: "Luisa123!", minLength: 8, maxLength: 15, pattern: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])/" }, confirmPassword: { required: true, type: () => String, description: "Debe ser un string con al menos una letra may\u00FAscula, una min\u00FAscula, un n\u00FAmero y un caracter especial", example: "Luisa123!" }, address: { required: true, type: () => String, description: "Debe ser un string con al menos 3 caracteres y no puede estar vac\u00EDo", example: "smallville 123", minLength: 3, maxLength: 80 }, phone: { required: true, type: () => Number, description: "Debe ser un n\u00FAmero y no puede estar vac\u00EDo", example: 123456789 }, country: { required: false, type: () => String, description: "Debe ser un string con al menos 5 caracteres y no puede estar vac\u00EDo", example: "Argentina", minLength: 5, maxLength: 20 }, city: { required: false, type: () => String, description: "Debe ser un string con al menos 5 caracteres y no puede estar vac\u00EDo", example: "Mendoza City", minLength: 5, maxLength: 20 } };
    }
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(15),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/, {
        message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.Validate)(MatchPassword_1.MatchPassword, ['password']),
    __metadata("design:type", String)
], CreateUserDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], CreateUserDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateUserDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateUserDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiHideProperty)(),
    (0, class_validator_1.IsEmpty)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isAdmin", void 0);
class LoginDto extends (0, swagger_1.PickType)(CreateUserDto, ['email', 'password']) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.LoginDto = LoginDto;
//# sourceMappingURL=create-user.dto.js.map