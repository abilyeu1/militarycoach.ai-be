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
exports.CoverLetterWizardDTO = void 0;
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
class CoverLetterWizardDTO {
    constructor() {
        this.name = 'John';
        this.age = 25;
        this.branchOfService = 'Army';
        this.languages = ['English', 'Spanish'];
        this.professionalCertificates = ['AWS', 'Google Cloud'];
        this.style = 'creative';
        this.tone = 'humble';
        this.jobDescription = 'Software Engineer';
        this.militaryRank = 'E-5';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, default: "John" }, age: { required: true, type: () => Number, default: 25 }, branchOfService: { required: true, type: () => String, default: "Army" }, languages: { required: true, type: () => [String], default: ['English', 'Spanish'] }, careers: { required: true, type: () => [Career] }, educations: { required: true, type: () => [Education] }, professionalCertificates: { required: true, type: () => [String], default: ['AWS', 'Google Cloud'] }, style: { required: true, type: () => String, default: "creative" }, tone: { required: true, type: () => String, default: "humble" }, jobDescription: { required: true, type: () => String, default: "Software Engineer" }, militaryRank: { required: true, type: () => String, default: "E-5" } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CoverLetterWizardDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], CoverLetterWizardDTO.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CoverLetterWizardDTO.prototype, "branchOfService", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CoverLetterWizardDTO.prototype, "languages", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Career),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CoverLetterWizardDTO.prototype, "careers", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Education),
    (0, class_validator_1.IsArray)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CoverLetterWizardDTO.prototype, "educations", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], CoverLetterWizardDTO.prototype, "professionalCertificates", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CoverLetterWizardDTO.prototype, "style", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CoverLetterWizardDTO.prototype, "tone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CoverLetterWizardDTO.prototype, "jobDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CoverLetterWizardDTO.prototype, "militaryRank", void 0);
exports.CoverLetterWizardDTO = CoverLetterWizardDTO;
//# sourceMappingURL=coverLetterWizard.dto.js.map