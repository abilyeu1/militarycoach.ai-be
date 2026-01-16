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
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schemas/users/user.schema");
const stripe_1 = require("stripe");
const axios_1 = require("axios");
const common_enum_1 = require("../../types/enums/common.enum");
let StripeService = StripeService_1 = class StripeService {
    constructor(configService, userModel) {
        this.configService = configService;
        this.userModel = userModel;
        StripeService_1.stripe = new stripe_1.default(this.configService.get('stripe.secret_key'), {
            apiVersion: '2023-08-16',
        });
    }
    async getProducts() {
        const plans = await StripeService_1.stripe.products.list({
            expand: ['data.default_price'],
            active: true,
        });
        return plans.data;
    }
    async createCustomer(body) {
        const customer = await StripeService_1.stripe.customers.create({
            email: body.email,
            name: body.name,
        });
        if (!customer)
            throw new common_1.HttpException(`Customer not created`, axios_1.HttpStatusCode.BadRequest);
        return customer;
    }
    async getCurrentSubscription(userID) {
        const user = await this.userModel.findOne({ _id: userID });
        if (!user)
            throw new common_1.HttpException(`User not found`, axios_1.HttpStatusCode.BadRequest);
        if (!user.stripeCustomerId)
            throw new common_1.HttpException(`Stripe Customer ID not found`, axios_1.HttpStatusCode.BadRequest);
        const subscription = await StripeService_1.stripe.subscriptions.retrieve(user.stripeSubscriptionId, { expand: ['items.data.price.product'] });
        return subscription;
    }
    async handleWebhookEvent(payload, sig, endpointSecret) {
        try {
            if (!sig) {
                throw new common_1.BadRequestException('Missing stripe-signature header');
            }
            let event;
            let internalWebhookStatus = '';
            console.log('==================================== STRIPE WEBHOOK EVENT =================================== ');
            try {
                event = StripeService_1.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
            }
            catch (err) {
                throw new Error(`Event: ${err.message}`);
            }
            switch (event.type) {
                case 'checkout.session.completed': {
                    const checkout_session = event.data.object;
                    console.log('************************************ EVENT TYPE ************************************ ', event.type);
                    console.log('==================================== Session completed =================================== ', checkout_session);
                    const user = await this.userModel.findOne({
                        _id: checkout_session.client_reference_id,
                        isAdmin: false,
                    });
                    console.log('==================================== STRIPE USER =================================== ', JSON.stringify(user, null, 2));
                    if (!user) {
                        throw new Error(`User not found with this customer ID ${checkout_session.customer}`);
                    }
                    console.log('Subscription id', checkout_session.subscription);
                    const subscription = await StripeService_1.stripe.subscriptions.retrieve(checkout_session.subscription, { expand: ['items.data.price.product'] });
                    const product = subscription.items.data[0].price.product;
                    console.log('==================================== SUBSCRIPTION =================================== ', JSON.stringify(subscription, null, 2));
                    console.log('check 1 ', product.metadata.messagesLimit);
                    console.log('check 2 ', product.metadata.messagesLimit ===
                        common_enum_1.MessageLimit.Unlimited);
                    try {
                        const updatedMessagesLimit = product.metadata.messagesLimit ===
                            undefined ||
                            product.metadata.messagesLimit === null
                            ? 0
                            : parseInt(product.metadata.messagesLimit, 10);
                        await this.userModel.findOneAndUpdate({ email: user.email }, {
                            stripeCustomerId: checkout_session.customer,
                            stripeSubscriptionStatus: common_enum_1.StripeStatus.ACTIVE,
                            stripeSubscriptionId: checkout_session.subscription,
                            stripePriceId: subscription.items.data[0].price.id,
                            freeMessagesLimitExhausted: false,
                            messagesConsumed: 0,
                            messagesLimit: updatedMessagesLimit,
                        }, { new: true });
                        internalWebhookStatus = 'first_time';
                    }
                    catch (err) {
                        console.log('================== ERROR ===========================', err);
                    }
                    console.log('==================================== STATUS =================================== ', internalWebhookStatus);
                    break;
                }
                case 'customer.subscription.deleted': {
                    const checkout_session = event.data.object;
                    console.log('************************************ EVENT TYPE ************************************ ', event.type);
                    console.log('==================================== Session deleted =================================== ', checkout_session);
                    const user = await this.userModel.findOne({
                        stripeCustomerId: event.data.object.customer,
                        isAdmin: false,
                    });
                    console.log('==================================== USER =================================== ', JSON.stringify(user, null, 2));
                    internalWebhookStatus = 'canceled';
                    await this.userModel.findOneAndUpdate({
                        stripeCustomerId: user.stripeCustomerId,
                    }, {
                        freeMessagesLimitExhausted: true,
                        messagesConsumed: user.messagesConsumed,
                        messagesLimit: user.messagesLimit,
                        stripeSubscriptionStatus: common_enum_1.StripeStatus.CANCELED,
                    }, { new: false });
                    console.log('==================================== INTERNAL WEBHOOK STATUS =================================== ', internalWebhookStatus);
                    break;
                }
                case 'customer.subscription.updated': {
                    const checkout_session = event.data.object;
                    console.log('==================================== Session updated =================================== ', checkout_session);
                    const user = await this.userModel.findOne({
                        stripeCustomerId: checkout_session.customer,
                        isAdmin: false,
                    });
                    console.log('==================================== USER =================================== ', JSON.stringify(user, null, 2));
                    if (!user) {
                        console.log('User not found with this cust_id');
                        break;
                    }
                    const subscription = await StripeService_1.stripe.subscriptions.retrieve(checkout_session.id, { expand: ['items.data.price.product'] });
                    const product = subscription.items.data[0].price.product;
                    console.log('==================================== PLAN =================================== ', JSON.stringify(subscription, null, 2));
                    if (user.stripeSubscriptionStatus === common_enum_1.StripeStatus.CANCELED) {
                        console.log('Inside condition: If user had a subscription and he cancelled the subscription, this condition will be triggered.');
                        internalWebhookStatus = 'canceled';
                        return await this.userModel.findOneAndUpdate({ stripeCustomerId: user.stripeCustomerId }, {
                            stripeSubscriptionStatus: common_enum_1.StripeStatus.CANCELED,
                            freeMessagesLimitExhausted: true,
                        }, { new: false });
                    }
                    else if (user.stripeSubscriptionStatus === common_enum_1.StripeStatus.FREE) {
                        console.log('Inside condition: If user plan is free, do nothing.');
                        internalWebhookStatus = 'free';
                        return await this.userModel.findOneAndUpdate({ stripeCustomerId: user.stripeCustomerId }, {
                            stripeSubscriptionStatus: common_enum_1.StripeStatus.FREE,
                            freeMessagesLimitExhausted: true,
                        }, { new: false });
                    }
                    else if (checkout_session.status === common_enum_1.StripeStatus.PAST_DUE) {
                        console.log('Inside condition: If the attached card declined while doing recurring payment the subscription status will become past_due');
                        internalWebhookStatus = 'past_due';
                        return await this.userModel.findOneAndUpdate({ stripeCustomerId: user.stripeCustomerId }, {
                            stripeSubscriptionStatus: common_enum_1.StripeStatus.PAST_DUE,
                            freeMessagesLimitExhausted: true,
                        }, { new: false });
                    }
                    else if (checkout_session.status === common_enum_1.StripeStatus.ACTIVE &&
                        !checkout_session.cancel_at_period_end &&
                        !checkout_session.cancel_at) {
                        console.log('Inside condition: After successful payment after the recurring time...If user has renewed the subscription, update the user price_id, sub_id and subscription status to active');
                        internalWebhookStatus = 'renewed';
                        return await this.userModel.findOneAndUpdate({
                            stripeCustomerId: user.stripeCustomerId,
                        }, {
                            stripeSubscriptionStatus: common_enum_1.StripeStatus.ACTIVE,
                            stripePriceId: subscription.items.data[0].price.id,
                            freeMessagesLimitExhausted: false,
                            messagesConsumed: 0,
                            messagesLimit: parseInt(product.metadata.messagesLimit),
                        }, { new: false });
                    }
                    console.log('==================================== STATUS =================================== ', internalWebhookStatus);
                    break;
                }
            }
        }
        catch (err) {
            throw new Error(`Webhook Error: ${err.message}`);
        }
    }
    async createBillingPortal(subscriptionID, customerID) {
        try {
            if (!subscriptionID)
                throw new common_1.HttpException(common_enum_1.StripeStatus.SUBSCRIPTION_ID_NOT_FOUND, axios_1.HttpStatusCode.NotFound);
            const portal = await StripeService_1.stripe.billingPortal.sessions.create({
                customer: customerID,
                return_url: `${process.env.ORIGIN}/tools`,
            });
            return {
                url: portal.url,
            };
        }
        catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }
    async createCheckoutSession(priceId, customerID) {
        try {
            const session = await StripeService_1.stripe.checkout.sessions.create({
                customer: customerID,
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                allow_promotion_codes: true,
                mode: 'subscription',
                success_url: `${process.env.ORIGIN}/tools`,
                cancel_url: `${process.env.ORIGIN}/tools?reason=cancelled`,
            });
            return session;
        }
        catch (err) {
            throw new Error(`Error: ${err.message}`);
        }
    }
};
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StripeService.prototype, "createCustomer", null);
StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model])
], StripeService);
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map