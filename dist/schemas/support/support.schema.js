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
exports.SupportSchema = exports.Support = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const common_enum_1 = require("../../types/enums/common.enum");
let Support = class Support {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Support.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Support.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Support.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: "" }),
    __metadata("design:type", String)
], Support.prototype, "reply", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: common_enum_1.SupportStatus.UNRESOLVED }),
    __metadata("design:type", String)
], Support.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Support.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Support.prototype, "updatedAt", void 0);
Support = __decorate([
    (0, mongoose_1.Schema)()
], Support);
exports.Support = Support;
exports.SupportSchema = mongoose_1.SchemaFactory.createForClass(Support);
//# sourceMappingURL=support.schema.js.map