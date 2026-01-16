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
exports.AdminController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const jwt_guard_1 = require("../../Guard/jwt.guard");
const authRole_guard_1 = require("../../Guard/authRole.guard");
const resetPassword_dto_1 = require("../auth/DTO/resetPassword.dto");
const verifyOtp_dto_1 = require("../auth/DTO/verifyOtp.dto");
const registerUser_dto_1 = require("../auth/DTO/registerUser.dto");
const updateUserProfile_dto_1 = require("../users/DTO/updateUserProfile.dto");
const addProduct_dto_1 = require("./DTO/addProduct.dto");
const updateProduct_dto_1 = require("./DTO/updateProduct.dto");
const adminAuth_dto_1 = require("./DTO/adminAuth.dto");
const newPassword_dto_1 = require("./DTO/newPassword.dto");
const supportReply_dto_1 = require("./DTO/supportReply.dto");
const user_enum_1 = require("../../types/enums/user.enum");
const common_enum_1 = require("../../types/enums/common.enum");
const roles_decorator_1 = require("../../Guard/roles.decorator");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async login(authData) {
        return await this.adminService.adminLogin(authData);
    }
    async requestResetPassword(reqBody) {
        return await this.adminService.adminRequestResetPassword(reqBody);
    }
    async verifyOtp(reqBody) {
        return await this.adminService.adminVerifyOtp(reqBody);
    }
    async resetPassword(reqBody) {
        return await this.adminService.adminResetPass(reqBody);
    }
    async addUser(user) {
        return await this.adminService.addUser(user);
    }
    async fetchUsers(page, limit, email, sub) {
        const result = await this.adminService.getAllUsers(limit, page, email, sub);
        return result;
    }
    async getUserById(id, req) {
        const { role } = req.user;
        return await this.adminService.getUserById(id);
    }
    async updateUserProfile(userProfile, id) {
        return await this.adminService.updateUserProfile(id, userProfile);
    }
    async delUser(id) {
        return await this.adminService.delUser(id);
    }
    async overview() {
        return await this.adminService.overview();
    }
    async getProducts() {
        return await this.adminService.getProducts();
    }
    async addProduct(body) {
        return await this.adminService.addProduct(body);
    }
    async editProduct(id, body) {
        return await this.adminService.updateProduct(id, body);
    }
    async fetchSupports(page, limit, email, status) {
        const result = await this.adminService.getSupports(limit, page, email, status);
        return result;
    }
    async getSupportById(id) {
        return await this.adminService.getSupportById(id);
    }
    async replySupport(body) {
        return await this.adminService.replySupport(body);
    }
};
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [adminAuth_dto_1.AdminAuthDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('requestResetPassword'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetPassword_dto_1.resetPasswordDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "requestResetPassword", null);
__decorate([
    (0, common_1.Post)('verifyOtp'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verifyOtp_dto_1.verifyOtpDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Post)('resetPassword'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newPassword_dto_1.newPasswordDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('/add-user'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registerUser_dto_1.RegisterUserDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addUser", null);
__decorate([
    (0, swagger_1.ApiQuery)({
        name: 'email',
        required: false,
    }),
    (0, common_1.Get)('get-users'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiQuery)({
        name: 'subscription',
        enum: user_enum_1.STRIPE_SUBSCRIPTION_STATUS,
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('email')),
    __param(3, (0, common_1.Query)('subscription')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "fetchUsers", null);
__decorate([
    (0, common_1.Get)('get-user/:user_id'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Put)('edit-user/:user_id'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateUserProfile_dto_1.UpdateUserProfileDto, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Delete)('delete-user/:user_id'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "delUser", null);
__decorate([
    (0, common_1.Get)('analytic-overview'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('add-product'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addProduct_dto_1.addProductDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addProduct", null);
__decorate([
    (0, common_1.Put)('edit-product/:product_id'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('product_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateProduct_dto_1.updateProductDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "editProduct", null);
__decorate([
    (0, common_1.Get)('get-supports'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        enum: common_enum_1.SupportStatus,
        required: false,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'email',
        required: false,
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('email')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "fetchSupports", null);
__decorate([
    (0, common_1.Get)('get-support/:support_id'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('support_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSupportById", null);
__decorate([
    (0, common_1.Post)('reply-support'),
    (0, roles_decorator_1.HasAuthRoles)(user_enum_1.AUTH_ROLES.ADMIN),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, authRole_guard_1.AuthRoleGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supportReply_dto_1.SupportReplyDTO]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "replySupport", null);
AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map