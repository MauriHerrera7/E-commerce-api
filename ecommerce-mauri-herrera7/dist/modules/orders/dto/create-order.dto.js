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
exports.CreateOrderDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateOrderDto {
    userId;
    products;
    static _OPENAPI_METADATA_FACTORY() {
        return { userId: { required: true, type: () => String, format: "uuid" }, products: { required: true, type: () => [require("../../products/entities/products.entity").Products], minItems: 1 } };
    }
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Debe ser un UUID, no puede estar vacio',
        example: 'e25479b9-26b3-43c3-936a-518500f0f44e',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Debe ser un arreglo con al menos un producto',
        example: [{ id: 'e25479b9-26b3-43c3-936a-518500f0f44e', },],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    __metadata("design:type", Object)
], CreateOrderDto.prototype, "products", void 0);
//# sourceMappingURL=create-order.dto.js.map