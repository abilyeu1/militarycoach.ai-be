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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_validator_1 = require("class-validator");
const common_enum_1 = require("../../types/enums/common.enum");
const user_enum_1 = require("../../types/enums/user.enum");
let User = class User {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], User.prototype, "sheerIdApprovalStatus", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], User.prototype, "languages", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "branchOfService", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "militaryRank", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], User.prototype, "workExperience", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: false, default: '' }),
    __metadata("design:type", String)
], User.prototype, "industryOfInterest", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: false, default: '' }),
    __metadata("design:type", String)
], User.prototype, "jobPositionOfInterest", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: false, default: '' }),
    __metadata("design:type", String)
], User.prototype, "jobPositionLevel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: false, default: '' }),
    __metadata("design:type", String)
], User.prototype, "JobLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Array)
], User.prototype, "education", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Array)
], User.prototype, "certificates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], User.prototype, "stripeSubscriptionId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: false, default: null }),
    __metadata("design:type", String)
], User.prototype, "stripePriceId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], User.prototype, "stripeSubscriptionStatus", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], User.prototype, "freeMessagesLimitExhausted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], User.prototype, "messagesConsumed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], User.prototype, "messagesLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], User.prototype, "freeUserHoursLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "profileStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], User.prototype, "resumeLink", void 0);
User = __decorate([
    (0, mongoose_1.Schema)()
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map