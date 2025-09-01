"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductsDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateProductsDto {
    name;
    description;
    price;
    stock;
    imgUrl;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, description: { required: true, type: () => String }, price: { required: true, type: () => Number }, stock: { required: true, type: () => Number }, imgUrl: { required: true, type: () => String } };
    }
}
exports.CreateProductsDto = CreateProductsDto;
//# sourceMappingURL=create-products.dto.js.map