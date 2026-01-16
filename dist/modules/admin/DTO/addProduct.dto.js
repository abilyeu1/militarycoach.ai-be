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
exports.addProductDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const isNotEmptyArray_1 = require("../../../customDecorators/isNotEmptyArray");
class featuresDTO {
    constructor() {
        this.name = 'Test1';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, default: "Test1" } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], featuresDTO.prototype, "name", void 0);
class addProductDTO {
    constructor() {
        this.name = 'Gold Special';
        this.unit_amount = 100;
        this.description = 'Product Description';
        this.interval_count = 12;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, default: "Gold Special" }, features: { required: true, type: () => [featuresDTO] }, unit_amount: { required: true, type: () => Number, default: 100 }, description: { required: true, type: () => String, default: "Product Description" }, interval_count: { required: true, type: () => Number, default: 12, minimum: 1, maximum: 12 } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], addProductDTO.prototype, "name", void 0);
__decorate([
    (0, isNotEmptyArray_1.IsNotEmptyArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => featuresDTO),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], addProductDTO.prototype, "features", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], addProductDTO.prototype, "unit_amount", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], addProductDTO.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], addProductDTO.prototype, "interval_count", void 0);
exports.addProductDTO = addProductDTO;
//# sourceMappingURL=addProduct.dto.js.map