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
exports.UpdateCareerAspirationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UpdateCareerAspirationDto {
    constructor() {
        this.industryOfInterest = 'Software';
        this.jobPositionOfInterest = 'Software Engineer';
        this.jobPositionLevel = 'Entry Level';
        this.JobLocation = 'Houston, TX';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { industryOfInterest: { required: true, type: () => String, default: "Software" }, jobPositionOfInterest: { required: true, type: () => String, default: "Software Engineer" }, jobPositionLevel: { required: true, type: () => String, default: "Entry Level" }, JobLocation: { required: false, type: () => String, default: "Houston, TX" } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateCareerAspirationDto.prototype, "industryOfInterest", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateCareerAspirationDto.prototype, "jobPositionOfInterest", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateCareerAspirationDto.prototype, "jobPositionLevel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UpdateCareerAspirationDto.prototype, "JobLocation", void 0);
exports.UpdateCareerAspirationDto = UpdateCareerAspirationDto;
//# sourceMappingURL=updateCareerAspiration.dto.js.map