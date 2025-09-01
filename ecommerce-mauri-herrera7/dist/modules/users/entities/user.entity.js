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
exports.Users = void 0;
const openapi = require("@nestjs/swagger");
const order_entity_1 = require("../../orders/entities/order.entity");
const typeorm_1 = require("typeorm");
let Users = class Users {
    id;
    name;
    email;
    password;
    phone;
    country;
    address;
    city;
    isAdmin;
    order;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String }, phone: { required: true, type: () => Number }, country: { required: true, type: () => String }, address: { required: true, type: () => String }, city: { required: true, type: () => String }, isAdmin: { required: true, type: () => Boolean }, order: { required: true, type: () => [require("../../orders/entities/order.entity").Orders] } };
    }
};
exports.Users = Users;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Users.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: false,
    }),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: false,
        unique: true,
    }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'bigint',
    }),
    __metadata("design:type", Number)
], Users.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], Users.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
    }),
    __metadata("design:type", String)
], Users.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], Users.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        default: false,
        nullable: true,
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "isAdmin", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Orders, (order) => order.user),
    __metadata("design:type", Array)
], Users.prototype, "order", void 0);
exports.Users = Users = __decorate([
    (0, typeorm_1.Entity)({ name: 'USERS' })
], Users);
//# sourceMappingURL=user.entity.js.map