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
exports.AddEducationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class AddEducationDto {
    constructor() {
        this._id = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';
        this.levelOfEducation = 'Bachelor';
        this.nameOfInstitution = 'University of California, Berkeley';
        this.degreeAndFieldOfStudy = 'B.S. Computer Science';
        this.Associates = 'B.S. Computer Science';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { _id: { required: true, type: () => String, default: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d" }, levelOfEducation: { required: true, type: () => String, default: "Bachelor" }, nameOfInstitution: { required: true, type: () => String, default: "University of California, Berkeley" }, degreeAndFieldOfStudy: { required: true, type: () => String, default: "B.S. Computer Science" }, Associates: { required: true, type: () => String, default: "B.S. Computer Science" } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)('all'),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AddEducationDto.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AddEducationDto.prototype, "levelOfEducation", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AddEducationDto.prototype, "nameOfInstitution", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AddEducationDto.prototype, "degreeAndFieldOfStudy", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], AddEducationDto.prototype, "Associates", void 0);
exports.AddEducationDto = AddEducationDto;
//# sourceMappingURL=addEducation.dto.js.map