import { RawBodyRequest } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/users/user.schema';
import { Response } from 'express';
import { StripeService } from './stripe.service';
import { ManageSubscriptionDTO } from './DTO/manageSubscription.dto';
import { CheckoutSessionDTO } from './DTO/createCheckout.dto';
import Stripe from 'stripe';
export declare class StripeController {
    private stripeService;
    private userModel;
    constructor(stripeService: StripeService, userModel: Model<UserDocument>);
    getProducts(): Promise<Stripe.Product[]>;
    handleWebhook(request: RawBodyRequest<Request>, signature: string, response: Response): Promise<void>;
    manageSubscription(body: ManageSubscriptionDTO): Promise<{
        url: string;
    }>;
    createCheckoutSession(body: CheckoutSessionDTO): Promise<{
        url: string;
    }>;
    getCurrentSubscription(req: {
        user: UserDocument;
    }): Promise<Stripe.Subscription | undefined>;
}
