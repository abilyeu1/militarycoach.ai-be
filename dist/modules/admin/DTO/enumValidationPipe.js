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
exports.EnumValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let EnumValidationPipe = class EnumValidationPipe {
    constructor(enumEntity) {
        this.enumEntity = enumEntity;
    }
    transform(value) {
        if ((0, class_validator_1.isDefined)(value) && (0, class_validator_1.isEnum)(value, this.enumEntity)) {
            return this.enumEntity[value];
        }
        else if (!(0, class_validator_1.isDefined)(value)) {
            return null;
        }
        else {
            const errorMessage = `the value ${value} is not valid. See the acceptable values: ${Object.keys(this.enumEntity).map(key => this.enumEntity[key])}`;
            throw new common_1.BadRequestException(errorMessage);
        }
    }
};
EnumValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], EnumValidationPipe);
exports.EnumValidationPipe = EnumValidationPipe;
//# sourceMappingURL=enumValidationPipe.js.map