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
exports.ManageSubscriptionDTO = void 0;
const openapi = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ManageSubscriptionDTO {
    constructor() {
        this.customerID = 'cus_Opa4a1GRV69Ybc';
        this.subscriptionID = 'sub_1O3ME1LspbC59PauFPwgiBHW';
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { customerID: { required: true, type: () => String, default: "cus_Opa4a1GRV69Ybc" }, subscriptionID: { required: true, type: () => String, default: "sub_1O3ME1LspbC59PauFPwgiBHW" } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ManageSubscriptionDTO.prototype, "customerID", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ManageSubscriptionDTO.prototype, "subscriptionID", void 0);
exports.ManageSubscriptionDTO = ManageSubscriptionDTO;
//# sourceMappingURL=manageSubscription.dto.js.map