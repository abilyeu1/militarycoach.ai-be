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
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const jwt_guard_1 = require("../../Guard/jwt.guard");
const addEducation_dto_1 = require("./DTO/addEducation.dto");
const addCertificate_dto_1 = require("./DTO/addCertificate.dto");
const addWorkExperience_dto_1 = require("./DTO/addWorkExperience.dto");
const updateCareerAspiration_dto_1 = require("./DTO/updateCareerAspiration.dto");
const updateUserProfile_dto_1 = require("./DTO/updateUserProfile.dto");
const askForSupport_dto_1 = require("./DTO/askForSupport.dto");
let UsersController = class UsersController {
    constructor(userService) {
        this.userService = userService;
    }
    async updateUserProfile(userProfile, req) {
        const { id } = req.user;
        return await this.userService.updateUserProfile(id, userProfile);
    }
    async getUserProfile(req) {
        const { id } = req.user;
        return await this.userService.getUserProfile(id);
    }
    async checkEmail(email) {
        return await this.userService.checkEmail(email);
    }
    async updateEducation(educationDocument, req) {
        const { id } = req.user;
        return await this.userService.updateEducation(id, educationDocument);
    }
    async addEducation(educationDocument, req) {
        const { id } = req.user;
        return await this.userService.addEducation(id, educationDocument);
    }
    async getEducationById(edu_id, req) {
        const { id } = req.user;
        return await this.userService.getEducationById(id, edu_id);
    }
    async getEducations(req) {
        const { id } = req.user;
        return await this.userService.getEducations(id);
    }
    async deleteEducation(edu_id, req) {
        const { id } = req.user;
        return await this.userService.deleteEducation(id, edu_id);
    }
    async updateCertificate(certificateDocument, req) {
        const { id } = req.user;
        return await this.userService.updateCertificate(id, certificateDocument);
    }
    async addCertificate(certificateDocument, req) {
        const { id } = req.user;
        return await this.userService.addCertificate(id, certificateDocument);
    }
    async getCertificateById(certificate_id, req) {
        const { id } = req.user;
        return await this.userService.getCertificateById(id, certificate_id);
    }
    async getCertificates(req) {
        const { id } = req.user;
        return await this.userService.getCertificates(id);
    }
    async deleteCertificate(certificate_id, req) {
        const { id } = req.user;
        return await this.userService.deleteCertificate(id, certificate_id);
    }
    async updateWorkExperience(workExperienceDocument, req) {
        const { id } = req.user;
        return await this.userService.updateWorkExperience(id, workExperienceDocument);
    }
    async addWorkExperience(workExperienceDocument, req) {
        const { id } = req.user;
        return await this.userService.addWorkExperience(id, workExperienceDocument);
    }
    async getWorkExperienceById(workExp_id, req) {
        const { id } = req.user;
        return await this.userService.getWorkExperienceById(id, workExp_id);
    }
    async getWorkExperience(req) {
        const { id } = req.user;
        return await this.userService.getWorkExperience(id);
    }
    async deleteWorkExperience(workExp_id, req) {
        const { id } = req.user;
        return await this.userService.deleteWorkExperience(id, workExp_id);
    }
    async updateCareerAspiration(careerDocument, req) {
        const { id } = req.user;
        return await this.userService.updateCareerAspiration(id, careerDocument);
    }
    async userSupport(body, req) {
        const { id } = req.user;
        return await this.userService.askForSupport(id, body);
    }
};
__decorate([
    (0, common_1.Put)('/edit-user-profile'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateUserProfile_dto_1.UpdateUserProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Get)('/user-profile'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserProfile", null);
__decorate([
    (0, common_1.Get)('/check-email/:email'),
    (0, swagger_1.ApiParam)({
        name: 'email',
        type: String,
        required: true,
    }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkEmail", null);
__decorate([
    (0, common_1.Put)('/edit-education'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addEducation_dto_1.AddEducationDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateEducation", null);
__decorate([
    (0, common_1.Post)('/add-education'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addEducation_dto_1.AddEducationDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addEducation", null);
__decorate([
    (0, common_1.Get)('/education/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getEducationById", null);
__decorate([
    (0, common_1.Get)('/education'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getEducations", null);
__decorate([
    (0, common_1.Delete)('/delete-education/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteEducation", null);
__decorate([
    (0, common_1.Put)('/edit-certificate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addCertificate_dto_1.AddCertificateDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCertificate", null);
__decorate([
    (0, common_1.Post)('/add-certificate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addCertificate_dto_1.AddCertificateDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addCertificate", null);
__decorate([
    (0, common_1.Get)('/certificate/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCertificateById", null);
__decorate([
    (0, common_1.Get)('/certificate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCertificates", null);
__decorate([
    (0, common_1.Delete)('/delete-certificate/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteCertificate", null);
__decorate([
    (0, common_1.Put)('/edit-workExperience'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addWorkExperience_dto_1.AddWorkExperienceDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateWorkExperience", null);
__decorate([
    (0, common_1.Post)('/add-workExperience'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addWorkExperience_dto_1.AddWorkExperienceDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addWorkExperience", null);
__decorate([
    (0, common_1.Get)('/workExperience/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getWorkExperienceById", null);
__decorate([
    (0, common_1.Get)('/workExperience'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getWorkExperience", null);
__decorate([
    (0, common_1.Delete)('/delete-workExperience/:id'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteWorkExperience", null);
__decorate([
    (0, common_1.Put)('/edit-careerAspiration'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateCareerAspiration_dto_1.UpdateCareerAspirationDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCareerAspiration", null);
__decorate([
    (0, common_1.Post)('/support'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [askForSupport_dto_1.AskForSupportDTO, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "userSupport", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map