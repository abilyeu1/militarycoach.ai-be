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
exports.UpdateUserProfileDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const isNotEmptyArray_1 = require("../../../customDecorators/isNotEmptyArray");
class WorkExperienceDto {
    constructor() {
        this._id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
        this.careerField = 'Software';
        this.jobTitle = 'Software Engineer';
        this.skillsLeveragedInCareerField = ['React', 'NodeJS'];
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: true, type: () => String, default: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }, careerField: { required: true, type: () => String, default: "Software" }, jobTitle: { required: true, type: () => String, default: "Software Engineer" }, skillsLeveragedInCareerField: { required: true, type: () => [String], default: ['React', 'NodeJS'] } };
    }
}
__decorate([
    (0, class_validator_1.IsUUID)('all'),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], WorkExperienceDto.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], WorkExperienceDto.prototype, "careerField", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], WorkExperienceDto.prototype, "jobTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, isNotEmptyArray_1.IsNotEmptyArray)({ message: 'Skills must not be an empty array' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], WorkExperienceDto.prototype, "skillsLeveragedInCareerField", void 0);
class EducationDto {
    constructor() {
        this._id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
        this.levelOfEducation = 'Bachelor';
        this.nameOfInstitution = 'University of California, Berkeley';
        this.degreeAndFieldOfStudy = 'B.S. Computer Science';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: true, type: () => String, default: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }, levelOfEducation: { required: true, type: () => String, default: "Bachelor" }, nameOfInstitution: { required: true, type: () => String, default: "University of California, Berkeley" }, degreeAndFieldOfStudy: { required: true, type: () => String, default: "B.S. Computer Science" } };
    }
}
__decorate([
    (0, class_validator_1.IsUUID)('all'),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EducationDto.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EducationDto.prototype, "levelOfEducation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EducationDto.prototype, "nameOfInstitution", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], EducationDto.prototype, "degreeAndFieldOfStudy", void 0);
class CertificatesDto {
    constructor() {
        this._id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
        this.name = 'AWS Certified Developer - Associate';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: true, type: () => String, default: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }, name: { required: true, type: () => String, default: "AWS Certified Developer - Associate" } };
    }
}
__decorate([
    (0, class_validator_1.IsUUID)('all'),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CertificatesDto.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], CertificatesDto.prototype, "name", void 0);
class UpdateUserProfileDto {
    constructor() {
        this.industryOfInterest = 'Software';
        this.jobPositionOfInterest = 'Software Engineer';
        this.jobPositionLevel = 'Entry Level';
        this.JobLocation = 'Houston, TX';
        this.fullName = 'Ali Raza';
        this.militaryRank = 'Sergeant';
        this.branchOfService = 'Army';
        this.languages = ['English'];
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { workExperience: { required: false, type: () => [WorkExperienceDto] }, education: { required: false, type: () => [EducationDto] }, certificates: { required: false, type: () => [CertificatesDto] }, industryOfInterest: { required: false, type: () => String, default: "Software" }, jobPositionOfInterest: { required: false, type: () => String, default: "Software Engineer" }, jobPositionLevel: { required: false, type: () => String, default: "Entry Level" }, JobLocation: { required: false, type: () => String, default: "Houston, TX" }, fullName: { required: false, type: () => String, default: "Ali Raza" }, age: { required: false, type: () => Number }, militaryRank: { required: false, type: () => String, default: "Sergeant" }, branchOfService: { required: false, type: () => String, default: "Army" }, languages: { required: false, type: () => [String], default: ['English'] } };
    }
}
__decorate([
    (0, isNotEmptyArray_1.IsNotEmptyArray)({ message: 'workExperience must not be an empty array' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WorkExperienceDto),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UpdateUserProfileDto.prototype, "workExperience", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => EducationDto),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UpdateUserProfileDto.prototype, "education", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CertificatesDto),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UpdateUserProfileDto.prototype, "certificates", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "industryOfInterest", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "jobPositionOfInterest", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "jobPositionLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "JobLocation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], UpdateUserProfileDto.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "militaryRank", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateUserProfileDto.prototype, "branchOfService", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], UpdateUserProfileDto.prototype, "languages", void 0);
exports.UpdateUserProfileDto = UpdateUserProfileDto;
//# sourceMappingURL=updateUserProfile.dto.js.map