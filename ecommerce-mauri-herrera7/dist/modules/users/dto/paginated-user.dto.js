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
exports.PaginatedUsersDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PaginatedUsersDTO {
    data;
    total;
    page;
    limit;
    totalPages;
    static _OPENAPI_METADATA_FACTORY() {
        return { data: { required: true, type: () => [require("../entities/user.entity").Users] }, total: { required: true, type: () => Number }, page: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, totalPages: { required: true, type: () => Number } };
    }
}
exports.PaginatedUsersDTO = PaginatedUsersDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], PaginatedUsersDTO.prototype, "data", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaginatedUsersDTO.prototype, "total", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaginatedUsersDTO.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaginatedUsersDTO.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PaginatedUsersDTO.prototype, "totalPages", void 0);
//# sourceMappingURL=paginated-user.dto.js.map