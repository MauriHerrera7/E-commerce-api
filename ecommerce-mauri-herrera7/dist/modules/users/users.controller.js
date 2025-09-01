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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const exclude_password_interceptor_1 = require("../../interceptors/exclude-password.interceptor");
const auth_guard_1 = require("../auth/auth.guard");
const roles_decorator_1 = require("../../decorators/roles.decorator");
const roles_enum_1 = require("../../roles.enum");
const roles_guard_1 = require("../auth/roles.guard");
const swagger_1 = require("@nestjs/swagger");
const update_user_dto_1 = require("./dto/update-user.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(page, limit) {
        if (limit && page) {
            return this.usersService.findAll(+page, +limit);
        }
        return this.usersService.findAll(1, 5);
    }
    findById(id) {
        return this.usersService.findById(id);
    }
    delete(id) {
        return this.usersService.delete(id);
    }
    update(id, user) {
        return this.usersService.update(id, user);
    }
    updateadmin(id) {
        return this.usersService.save(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los usuarios (solo para administradores)' }),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: require("./dto/paginated-user.dto").PaginatedUsersDTO }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener los usuarios por id (solo para administradores)' }),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar usuario (solo para administradores)' }),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.Admin),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "delete", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar usuario' }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)(':id'),
    openapi.ApiResponse({ status: 200, type: require("./dto/response-user.dto").CreateAndUpdateUserResponseDTO }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('updateadmin/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateadmin", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.UseInterceptors)(exclude_password_interceptor_1.ExcludePasswordInterceptor),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map