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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schemas/users/user.schema");
const stripe_service_1 = require("./stripe.service");
const manageSubscription_dto_1 = require("./DTO/manageSubscription.dto");
const createCheckout_dto_1 = require("./DTO/createCheckout.dto");
const jwt_guard_1 = require("../../Guard/jwt.guard");
let StripeController = class StripeController {
    constructor(stripeService, userModel) {
        this.stripeService = stripeService;
        this.userModel = userModel;
    }
    async getProducts() {
        return await this.stripeService.getProducts();
    }
    async handleWebhook(request, signature, response) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        try {
            await this.stripeService.handleWebhookEvent(request.rawBody, signature, endpointSecret);
            response.status(200).send('Webhook handled successfully');
        }
        catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
    async manageSubscription(body) {
        const { customerID, subscriptionID } = body;
        return await this.stripeService.createBillingPortal(subscriptionID, customerID);
    }
    async createCheckoutSession(body) {
        const { priceId, customerID } = body;
        const session = await this.stripeService.createCheckoutSession(priceId, customerID);
        return { url: session.url };
    }
    async getCurrentSubscription(req) {
        const { user } = req;
        return await this.stripeService.getCurrentSubscription(user.id);
    }
};
__decorate([
    (0, common_1.Get)('products'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Post)('/webhook'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)('manageSubscription'),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [manageSubscription_dto_1.ManageSubscriptionDTO]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "manageSubscription", null);
__decorate([
    (0, common_1.Post)('create-checkout-session'),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createCheckout_dto_1.CheckoutSessionDTO]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Get)('current-subscription'),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "getCurrentSubscription", null);
StripeController = __decorate([
    (0, common_1.Controller)('stripe'),
    (0, swagger_1.ApiTags)('stripe'),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [stripe_service_1.StripeService,
        mongoose_2.Model])
], StripeController);
exports.StripeController = StripeController;
//# sourceMappingURL=stripe.controller.js.map