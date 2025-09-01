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
exports.Orders = void 0;
const openapi = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
const orderDetails_entity_1 = require("./orderDetails.entity");
let Orders = class Orders {
    id;
    date;
    orderDetails;
    user;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, date: { required: true, type: () => Date }, orderDetails: { required: true, type: () => require("./orderDetails.entity").OrderDetails }, user: { required: true, type: () => require("../../users/entities/user.entity").Users } };
    }
};
exports.Orders = Orders;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Orders.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Orders.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => orderDetails_entity_1.OrderDetails, (orderDetails) => orderDetails.order),
    __metadata("design:type", orderDetails_entity_1.OrderDetails)
], Orders.prototype, "orderDetails", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.Users, (user) => user.order),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.Users)
], Orders.prototype, "user", void 0);
exports.Orders = Orders = __decorate([
    (0, typeorm_1.Entity)({ name: 'ORDERS' })
], Orders);
//# sourceMappingURL=order.entity.js.map