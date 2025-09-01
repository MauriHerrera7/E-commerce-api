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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const order_entity_1 = require("./entities/order.entity");
const orderDetails_entity_1 = require("./entities/orderDetails.entity");
const products_entity_1 = require("../products/entities/products.entity");
let OrdersService = class OrdersService {
    usersRepository;
    ordersRepository;
    OrderDetailsRepository;
    productsRepository;
    constructor(usersRepository, ordersRepository, OrderDetailsRepository, productsRepository) {
        this.usersRepository = usersRepository;
        this.ordersRepository = ordersRepository;
        this.OrderDetailsRepository = OrderDetailsRepository;
        this.productsRepository = productsRepository;
    }
    async create(createOrderDto) {
        const user = await this.usersRepository.findOneBy({
            id: createOrderDto.userId,
        });
        if (!user) {
            throw new common_1.NotFoundException('USUARIO NO ENCONTRADO');
        }
        const order = new order_entity_1.Orders();
        order.user = user;
        order.date = new Date();
        const newOrder = await this.ordersRepository.save(order);
        let total = 0;
        const productsArray = await Promise.all(createOrderDto.products.map(async (element) => {
            const product = await this.productsRepository.findOneBy({
                id: element?.id,
            });
            if (!product) {
                throw new Error('PRODUCTO NO ENCONTRADO');
            }
            total += Number(product.price);
            await this.productsRepository.update({ id: product.id }, { stock: product.stock - 1 });
            if (product.stock < 0) {
                throw new common_1.NotFoundException('STOCK INSUFICIENTE');
            }
            return product;
        }));
        const orderDetail = new orderDetails_entity_1.OrderDetails();
        orderDetail.order = newOrder;
        orderDetail.price = Number(total.toFixed(2));
        orderDetail.products = productsArray;
        await this.OrderDetailsRepository.save(orderDetail);
        const createdOrder = await this.ordersRepository.findOne({
            where: { id: newOrder.id },
            relations: {
                orderDetails: {
                    products: true,
                },
            },
        });
        return {
            message: 'ORDEN CREADA CORRECTAMENTE',
            order: createdOrder,
        };
    }
    async findOne(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: {
                orderDetails: {
                    products: true,
                },
            },
        });
        if (!order) {
            throw new Error('ORDEN NO ENCONTRADA');
        }
        return {
            message: 'ORDEN ENCONTRADA',
            data: order,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.Users)),
    __param(1, (0, typeorm_2.InjectRepository)(order_entity_1.Orders)),
    __param(2, (0, typeorm_2.InjectRepository)(orderDetails_entity_1.OrderDetails)),
    __param(3, (0, typeorm_2.InjectRepository)(products_entity_1.Products)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map