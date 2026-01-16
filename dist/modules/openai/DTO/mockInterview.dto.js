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
exports.MockInterviewDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class Career {
    constructor() {
        this.careerField = 'Software Engineer';
        this.skills = ['Python', 'JavaScript', 'React'];
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { careerField: { required: true, type: () => String, default: "Software Engineer" }, skills: { required: true, type: () => [String], default: ['Python', 'JavaScript', 'React'] } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Career.prototype, "careerField", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], Career.prototype, "skills", void 0);
class Education {
    constructor() {
        this.levelOfEducation = 'Bachelor';
        this.nameOfInstitution = 'University of California, Berkeley';
        this.degreeAndFieldOfStudy = 'Computer Science';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { levelOfEducation: { required: true, type: () => String, default: "Bachelor" }, nameOfInstitution: { required: true, type: () => String, default: "University of California, Berkeley" }, degreeAndFieldOfStudy: { required: true, type: () => String, default: "Computer Science" } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Education.prototype, "levelOfEducation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Education.prototype, "nameOfInstitution", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Education.prototype, "degreeAndFieldOfStudy", void 0);
class Message {
    constructor() {
        this.role = 'user';
        this.content = 'What are some potential career paths for me?';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { role: { required: true, type: () => String, default: "user" }, content: { required: true, type: () => String, default: "What are some potential career paths for me?" } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Message.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
class MI_PromptDetails {
    constructor() {
        this.name = 'John';
        this.age = 25;
        this.branchOfService = 'Army';
        this.languages = ['English', 'Spanish'];
        this.professionalCertificates = ['AWS', 'Google Cloud'];
        this.industryOfInterest = 'Technology';
        this.jobPositionLevel = 'Entry Level';
        this.interviewFormat = 'onsite';
        this.militaryRank = 'E-5';
        this.jobPositionTitle = 'Software Engineer';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, default: "John" }, age: { required: true, type: () => Number, default: 25 }, branchOfService: { required: true, type: () => String, default: "Army" }, languages: { required: true, type: () => [String], default: ['English', 'Spanish'] }, careers: { required: true, type: () => [Career] }, educations: { required: true, type: () => [Education] }, professionalCertificates: { required: true, type: () => [String], default: ['AWS', 'Google Cloud'] }, industryOfInterest: { required: true, type: () => String, default: "Technology" }, jobPositionLevel: { required: true, type: () => String, default: "Entry Level" }, interviewFormat: { required: true, type: () => String, default: "onsite" }, militaryRank: { required: true, type: () => String, default: "E-5" }, jobPositionTitle: { required: true, type: () => String, default: "Software Engineer" } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MI_PromptDetails.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], MI_PromptDetails.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MI_PromptDetails.prototype, "branchOfService", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], MI_PromptDetails.prototype, "languages", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Career),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], MI_PromptDetails.prototype, "careers", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Education),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], MI_PromptDetails.prototype, "educations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], MI_PromptDetails.prototype, "professionalCertificates", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MI_PromptDetails.prototype, "industryOfInterest", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MI_PromptDetails.prototype, "jobPositionLevel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MI_PromptDetails.prototype, "interviewFormat", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MI_PromptDetails.prototype, "militaryRank", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], MI_PromptDetails.prototype, "jobPositionTitle", void 0);
class MockInterviewDTO {
    constructor() {
        this.message = [
            {
                role: 'user',
                content: 'What are some potential career paths for me?',
            },
        ];
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => [Message], default: [
                    {
                        role: 'user',
                        content: 'What are some potential career paths for me?',
                    },
                ] }, promptDetails: { required: true, type: () => MI_PromptDetails } };
    }
}
exports.MockInterviewDTO = MockInterviewDTO;
//# sourceMappingURL=mockInterview.dto.js.map