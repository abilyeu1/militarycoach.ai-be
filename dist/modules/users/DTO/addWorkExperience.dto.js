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
exports.AddWorkExperienceDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const isNotEmptyArray_1 = require("../../../customDecorators/isNotEmptyArray");
class AddWorkExperienceDto {
    constructor() {
        this._id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
        this.careerField = 'Software';
        this.jobTitle = 'Software Engineer';
        this.yearsInCareerField = 1;
        this.skillsLeveragedInCareerField = ['React', 'NodeJS'];
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: true, type: () => String, default: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }, careerField: { required: true, type: () => String, default: "Software" }, jobTitle: { required: true, type: () => String, default: "Software Engineer" }, yearsInCareerField: { required: true, type: () => Number, default: 1 }, skillsLeveragedInCareerField: { required: true, type: () => [String], default: ['React', 'NodeJS'] } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)('all'),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AddWorkExperienceDto.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AddWorkExperienceDto.prototype, "careerField", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AddWorkExperienceDto.prototype, "jobTitle", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], AddWorkExperienceDto.prototype, "yearsInCareerField", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, isNotEmptyArray_1.IsNotEmptyArray)({ message: 'Skills must not be an empty array' }),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], AddWorkExperienceDto.prototype, "skillsLeveragedInCareerField", void 0);
exports.AddWorkExperienceDto = AddWorkExperienceDto;
//# sourceMappingURL=addWorkExperience.dto.js.map