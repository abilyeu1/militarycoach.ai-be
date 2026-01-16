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
exports.OpenaiController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const openai_service_1 = require("./openai.service");
const jwt_guard_1 = require("../../Guard/jwt.guard");
const fileHandler_dto_1 = require("../s3/DTO/fileHandler.dto");
const careerWizard_dto_1 = require("./DTO/careerWizard.dto");
const coverLetterWizard_dto_1 = require("./DTO/coverLetterWizard.dto");
const mockInterview_dto_1 = require("./DTO/mockInterview.dto");
const skillsGapAnalysis_dto_1 = require("./DTO/skillsGapAnalysis.dto");
let OpenaiController = class OpenaiController {
    constructor(openaiService) {
        this.openaiService = openaiService;
    }
    async bulletTranslator({ bullet }, req) {
        const { user } = req;
        return await this.openaiService.bulletTranslator(user.id, bullet);
    }
    async careerWizardTool({ chatID }, career, req) {
        const { user } = req;
        return await this.openaiService.careerWizard(chatID, user.id, career);
    }
    async coverLetterWizardTool(career, req) {
        const { user } = req;
        return await this.openaiService.coverLetterWizard(user.id, career);
    }
    async mockInterview({ chatID }, career, req) {
        const { user } = req;
        return await this.openaiService.mockInterview(chatID, user.id, career);
    }
    async skillsGapAnalysis({ chatID }, career, req) {
        const { user } = req;
        return await this.openaiService.skillsGapAnalysis(chatID, user.id, career);
    }
    async upload(file) {
        try {
            return await this.openaiService.parseCV(file);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async recommendIndustry(req) {
        const { user } = req;
        return await this.openaiService.recommendIndustry(user.id);
    }
};
__decorate([
    (0, common_1.Post)('/bullet-translator'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                bullet: {
                    type: 'string',
                    example: 'Bullet point text here',
                },
            },
        },
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "bulletTranslator", null);
__decorate([
    (0, common_1.Post)('/career-wizard/:chatID'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiParam)({
        name: 'chatID',
        type: String,
        required: true,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, careerWizard_dto_1.CareerWizardDTO, Object]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "careerWizardTool", null);
__decorate([
    (0, common_1.Post)('/cover-letter-wizard'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coverLetterWizard_dto_1.CoverLetterWizardDTO, Object]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "coverLetterWizardTool", null);
__decorate([
    (0, common_1.Post)('/mock-interview/:chatID'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiParam)({
        name: 'chatID',
        type: String,
        required: true,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mockInterview_dto_1.MockInterviewDTO, Object]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "mockInterview", null);
__decorate([
    (0, common_1.Post)('/skills-gap-analysis/:chatID'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiParam)({
        name: 'chatID',
        type: String,
        required: true,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, skillsGapAnalysis_dto_1.SkillsGapAnalysisDTO, Object]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "skillsGapAnalysis", null);
__decorate([
    (0, common_1.Post)('/parse-cv'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Upload your file here',
        type: fileHandler_dto_1.FileUploadDto,
    }),
    openapi.ApiResponse({ status: 201, type: String }),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('/recommend-industry'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OpenaiController.prototype, "recommendIndustry", null);
OpenaiController = __decorate([
    (0, common_1.Controller)('openai'),
    (0, swagger_1.ApiTags)('Open AI'),
    __metadata("design:paramtypes", [openai_service_1.OpenaiService])
], OpenaiController);
exports.OpenaiController = OpenaiController;
//# sourceMappingURL=openai.controller.js.map