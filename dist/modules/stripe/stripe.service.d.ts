/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/users/user.schema';
import Stripe from 'stripe';
export declare class StripeService {
    private configService;
    private userModel;
    static stripe: Stripe;
    constructor(configService: ConfigService, userModel: Model<UserDocument>);
    getProducts(): Promise<Stripe.Product[]>;
    createCustomer(body: {
        email: string;
        name: string;
    }): Promise<Stripe.Customer>;
    getCurrentSubscription(userID: string): Promise<Stripe.Subscription | undefined>;
    handleWebhookEvent(payload: any, sig: string, endpointSecret: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    createBillingPortal(subscriptionID: string, customerID: string): Promise<{
        url: string;
    }>;
    createCheckoutSession(priceId: string, customerID: string): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
