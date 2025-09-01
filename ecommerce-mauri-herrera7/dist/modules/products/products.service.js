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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const products_entity_1 = require("./entities/products.entity");
const typeorm_2 = require("@nestjs/typeorm");
const data = require("../../data.json");
const category_entity_1 = require("../categories/entities/category.entity");
let ProductsService = class ProductsService {
    productsRepository;
    categoriesRepository;
    constructor(productsRepository, categoriesRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    async seeder() {
        const categories = await this.categoriesRepository.find();
        const newProducts = data
            .map((element) => {
            const category = categories.find((cat) => cat.name === element.category);
            if (!category) {
                console.warn(`Categoría no encontrada para el producto: ${element.name}`);
                return null;
            }
            const newProduct = new products_entity_1.Products();
            newProduct.name = element.name;
            newProduct.description = element.description;
            newProduct.price = element.price;
            newProduct.imgUrl = element.imgUrl;
            newProduct.stock = element.stock;
            newProduct.category = category;
            return newProduct;
        })
            .filter((p) => p !== null);
        const result = await this.productsRepository.upsert(newProducts, ['name']);
        return {
            message: 'PRODUCTOS AGREGADOS CORRECTAMENTE',
            total: newProducts.length,
            inserted: result.generatedMaps.length,
        };
    }
    async getproducts(page, limit) {
        let products = await this.productsRepository.find({
            relations: ['category'],
        });
        const start = (page - 1) * limit;
        const end = start + limit;
        products = products.slice(start, end);
        if (!products || products.length === 0) {
            throw new common_1.NotFoundException('NO HAY PRODUCTOS');
        }
        return {
            message: 'ESTOS SON LOS PRODUCTOS',
            products,
        };
    }
    async updateProductInfo(id, updateData) {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) {
            throw new common_1.NotFoundException('PRODUCTO NO ENCONTRADO');
        }
        await this.productsRepository.update(id, updateData);
        return await this.productsRepository.findOneBy({ id });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(products_entity_1.Products)),
    __param(1, (0, typeorm_2.InjectRepository)(category_entity_1.Categories)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map