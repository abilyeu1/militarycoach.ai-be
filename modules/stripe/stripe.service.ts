// Nest Js Imports
import {
  BadRequestException,
  Body,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

// Mongo Imports
import { Model } from 'mongoose';

// Service Imports

// Schema Imports
import { User, UserDocument } from 'src/schemas/users/user.schema';

// Stripe Imports
import Stripe from 'stripe';

// axios Imports
import { HttpStatusCode } from 'axios';
import { MessageLimit, StripeStatus } from 'src/types/enums/common.enum';

@Injectable()
export class StripeService {
  public static stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    StripeService.stripe = new Stripe(
      this.configService.get<string>('stripe.secret_key'),
      {
        apiVersion: '2023-08-16',
      },
    );
  }

  // =================== Fetch Products from stripe. ======================
  /**
   * @description This API is used to get all products from stripe.
   * @returns stripe products.
   */
  async getProducts(): Promise<Stripe.Product[]> {
    const plans = await StripeService.stripe.products.list({
      expand: ['data.default_price'],
      active: true,
    });

    return plans.data;
  }

  // =================== Create Customer ======================
  /**
   * Create a customer in Stripe
   * @param body
   * @returns
   */
  async createCustomer(
    @Body() body: { email: string; name: string },
  ): Promise<Stripe.Customer> {
    const customer = await StripeService.stripe.customers.create({
      email: body.email,
      name: body.name,
    });

    if (!customer)
      throw new HttpException(
        `Customer not created`,
        HttpStatusCode.BadRequest,
      );

    return customer;
  }

  async getCurrentSubscription(
    userID: string,
  ): Promise<Stripe.Subscription | undefined> {
    const user = await this.userModel.findOne({ _id: userID });

    if (!user)
      throw new HttpException(`User not found`, HttpStatusCode.BadRequest);

    if (!user.stripeCustomerId)
      throw new HttpException(
        `Stripe Customer ID not found`,
        HttpStatusCode.BadRequest,
      );

    const subscription = await StripeService.stripe.subscriptions.retrieve(
      user.stripeSubscriptionId,
      { expand: ['items.data.price.product'] },
    );

    return subscription;
  }
  //#region : PAYMENT INTEGRATION FLOW

  // ======================= webhook handler ========================
  /**
   * @description Handle Stripe Webhook, update user subscription status
   * @param payload: stripe payload
   * @param sig: stripe-signature
   * @param endpointSecret: stripe webhook secret
   * @returns Updated User
   */
  async handleWebhookEvent(payload: any, sig: string, endpointSecret: string) {
    try {
      if (!sig) {
        throw new BadRequestException('Missing stripe-signature header');
      }
      let event;
      let internalWebhookStatus: string = '';

      console.log(
        '==================================== STRIPE WEBHOOK EVENT =================================== ',
      );
      try {
        event = StripeService.stripe.webhooks.constructEvent(
          payload,
          sig,
          endpointSecret,
        );
      } catch (err) {
        throw new Error(`Event: ${err.message}`);
      }
      switch (event.type) {
        case 'checkout.session.completed': {
          const checkout_session = event.data.object;

          console.log(
            '************************************ EVENT TYPE ************************************ ',
            event.type,
          );

          console.log(
            '==================================== Session completed =================================== ',
            checkout_session,
          );

          const user = await this.userModel.findOne({
            _id: checkout_session.client_reference_id,
            isAdmin: false,
          });

          console.log(
            '==================================== STRIPE USER =================================== ',
            JSON.stringify(user, null, 2),
          );

          if (!user) {
            throw new Error(
              `User not found with this customer ID ${checkout_session.customer}`,
            );
          }

          console.log('Subscription id', checkout_session.subscription);

          const subscription =
            await StripeService.stripe.subscriptions.retrieve(
              checkout_session.subscription,
              { expand: ['items.data.price.product'] },
            );

          const product = subscription.items.data[0].price.product;

          console.log(
            '==================================== SUBSCRIPTION =================================== ',
            JSON.stringify(subscription, null, 2),
          );

          console.log(
            'check 1 ',
            (product as Stripe.Product).metadata.messagesLimit,
          );

          console.log(
            'check 2 ',
            (product as Stripe.Product).metadata.messagesLimit ===
              MessageLimit.Unlimited,
          );

          try {
            const updatedMessagesLimit =
              (product as Stripe.Product).metadata.messagesLimit ===
                undefined ||
              (product as Stripe.Product).metadata.messagesLimit === null
                ? 0
                : parseInt(
                    (product as Stripe.Product).metadata.messagesLimit,
                    10,
                  );

            await this.userModel.findOneAndUpdate(
              { email: user.email },
              {
                stripeCustomerId: checkout_session.customer,
                stripeSubscriptionStatus: StripeStatus.ACTIVE,
                stripeSubscriptionId: checkout_session.subscription,
                stripePriceId: subscription.items.data[0].price.id,
                freeMessagesLimitExhausted: false,
                // It is set to 0 because, if a user cancels his subscription and then renews it, then the messages consumed by him should be reset to 0.
                messagesConsumed: 0,
                messagesLimit: updatedMessagesLimit,
              },
              { new: true },
            );
            internalWebhookStatus = 'first_time';
          } catch (err) {
            console.log(
              '================== ERROR ===========================',
              err,
            );
          }

          console.log(
            '==================================== STATUS =================================== ',
            internalWebhookStatus,
          );
          break;
        }
        case 'customer.subscription.deleted': {
          const checkout_session = event.data.object;

          console.log(
            '************************************ EVENT TYPE ************************************ ',
            event.type,
          );

          console.log(
            '==================================== Session deleted =================================== ',
            checkout_session,
          );

          const user = await this.userModel.findOne({
            stripeCustomerId: event.data.object.customer,
            isAdmin: false,
          });

          console.log(
            '==================================== USER =================================== ',
            JSON.stringify(user, null, 2),
          );

          internalWebhookStatus = 'canceled';

          await this.userModel.findOneAndUpdate(
            {
              stripeCustomerId: user.stripeCustomerId,
            },
            {
              freeMessagesLimitExhausted: true,
              messagesConsumed: user.messagesConsumed,
              messagesLimit: user.messagesLimit,
              stripeSubscriptionStatus: StripeStatus.CANCELED,
            },
            { new: false },
          );

          console.log(
            '==================================== INTERNAL WEBHOOK STATUS =================================== ',
            internalWebhookStatus,
          );

          break;
        }
        case 'customer.subscription.updated': {
          // Fetch user from database by customer id.
          const checkout_session = event.data.object;

          console.log(
            '==================================== Session updated =================================== ',
            checkout_session,
          );

          const user = await this.userModel.findOne({
            stripeCustomerId: checkout_session.customer,
            isAdmin: false,
          });

          console.log(
            '==================================== USER =================================== ',
            JSON.stringify(user, null, 2),
          );

          if (!user) {
            console.log('User not found with this cust_id');
            break;
          }

          const subscription =
            await StripeService.stripe.subscriptions.retrieve(
              checkout_session.id,
              { expand: ['items.data.price.product'] },
            );

          const product = subscription.items.data[0].price.product;

          console.log(
            '==================================== PLAN =================================== ',
            JSON.stringify(subscription, null, 2),
          );

          // If user had a subscription and he cancelled the subscription, this condition will be triggered.
          if (user.stripeSubscriptionStatus === StripeStatus.CANCELED) {
            console.log(
              'Inside condition: If user had a subscription and he cancelled the subscription, this condition will be triggered.',
            );

            internalWebhookStatus = 'canceled';

            return await this.userModel.findOneAndUpdate(
              { stripeCustomerId: user.stripeCustomerId },
              {
                stripeSubscriptionStatus: StripeStatus.CANCELED,
                freeMessagesLimitExhausted: true,
              },
              { new: false },
            );
          }

          // If user plan is free, do nothing.
          else if (user.stripeSubscriptionStatus === StripeStatus.FREE) {
            console.log('Inside condition: If user plan is free, do nothing.');

            internalWebhookStatus = 'free';

            return await this.userModel.findOneAndUpdate(
              { stripeCustomerId: user.stripeCustomerId },
              {
                stripeSubscriptionStatus: StripeStatus.FREE,
                freeMessagesLimitExhausted: true,
              },
              { new: false },
            );
          }

          //If the attached card declined while doing recurring payment the subscription status will become past_due
          else if (checkout_session.status === StripeStatus.PAST_DUE) {
            console.log(
              'Inside condition: If the attached card declined while doing recurring payment the subscription status will become past_due',
            );

            internalWebhookStatus = 'past_due';

            return await this.userModel.findOneAndUpdate(
              { stripeCustomerId: user.stripeCustomerId },
              {
                stripeSubscriptionStatus: StripeStatus.PAST_DUE,
                freeMessagesLimitExhausted: true,
              },
              { new: false },
            );
          }

          // If user has renewed the subscription, update the user price_id, sub_id and subscription status to active.
          else if (
            checkout_session.status === StripeStatus.ACTIVE &&
            !checkout_session.cancel_at_period_end &&
            !checkout_session.cancel_at
          ) {
            //After successful payment after the recurring time...
            console.log(
              'Inside condition: After successful payment after the recurring time...If user has renewed the subscription, update the user price_id, sub_id and subscription status to active',
            );

            internalWebhookStatus = 'renewed';

            return await this.userModel.findOneAndUpdate(
              {
                stripeCustomerId: user.stripeCustomerId,
              },
              {
                stripeSubscriptionStatus: StripeStatus.ACTIVE,
                stripePriceId: subscription.items.data[0].price.id,
                freeMessagesLimitExhausted: false,
                messagesConsumed: 0,
                messagesLimit: parseInt(
                  (product as Stripe.Product).metadata.messagesLimit,
                ) as number,
              },
              { new: false },
            );
          }

          console.log(
            '==================================== STATUS =================================== ',
            internalWebhookStatus,
          );

          break;
        }
      }
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }

  async createBillingPortal(
    subscriptionID: string,
    customerID: string,
  ): Promise<{ url: string }> {
    try {
      if (!subscriptionID)
        throw new HttpException(
          StripeStatus.SUBSCRIPTION_ID_NOT_FOUND,
          HttpStatusCode.NotFound,
        );

      const portal = await StripeService.stripe.billingPortal.sessions.create({
        customer: customerID,
        return_url: `${process.env.ORIGIN}/tools`,
      });

      return {
        url: portal.url,
      };
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  }

  async createCheckoutSession(priceId: string, customerID: string) {
    try {
      // Fetch the product and associated price ID from Stripe
      const session = await StripeService.stripe.checkout.sessions.create({
        customer: customerID,
        payment_method_types: ['card'],

        line_items: [
          {
            price: priceId, // Use the price ID
            quantity: 1,
          },
        ],
        allow_promotion_codes: true, // Allow promotion codes if needed
        mode: 'subscription', // Set the mode to 'subscription'
        success_url: `${process.env.ORIGIN}/tools`,
        cancel_url: `${process.env.ORIGIN}/tools?reason=cancelled`,
      });

      return session;
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  }

  //#endregion
}
