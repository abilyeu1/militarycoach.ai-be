// Nest Js Imports
import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  RawBodyRequest,
  Request,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// Mongo Imports
import { Model } from 'mongoose';

// Schema Imports
import { User, UserDocument } from 'src/schemas/users/user.schema';

// Express Imports
import { Response } from 'express';

// Service Imports
import { StripeService } from './stripe.service';

// DTO Imports
import { ManageSubscriptionDTO } from './DTO/manageSubscription.dto';
import { CheckoutSessionDTO } from './DTO/createCheckout.dto';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';

// Stripe Imports
import Stripe from 'stripe';

@Controller('stripe')
@ApiTags('stripe')
export class StripeController {
  constructor(
    private stripeService: StripeService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // =================== GET: Get Products ======================
  /**
   * This API is used to get all products
   * @returns products
   */
  @Get('products')
  async getProducts() {
    return await this.stripeService.getProducts();
  }

  //#region : PAYMENT INTEGRATION FLOW

  // ============================ POST : Webhook ============================
  @Post('/webhook')
  async handleWebhook(
    @Request() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @Res() response: Response,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      await this.stripeService.handleWebhookEvent(
        request.rawBody,
        signature,
        endpointSecret,
      );

      response.status(200).send('Webhook handled successfully');
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  // =================== POST: Manage Subscription ======================
  /**
   * This API is used to manage subscription
   * @BODY body: { customerID }
   * @PARAM subscriptionID
   * @returns Stripe Portal URL.
   */
  @Post('manageSubscription')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async manageSubscription(@Body() body: ManageSubscriptionDTO) {
    const { customerID, subscriptionID } = body;
    return await this.stripeService.createBillingPortal(
      subscriptionID,
      customerID,
    );
  }

  @Post('create-checkout-session')
  @ApiBearerAuth('jwt')
  @UsePipes(ValidationPipe)
  async createCheckoutSession(@Body() body: CheckoutSessionDTO) {
    const { priceId, customerID } = body;
    const session = await this.stripeService.createCheckoutSession(
      priceId,
      customerID,
    );
    return { url: session.url };
  }

  // =================== GET: Current Subscription ======================
  /**
   * This API is used to get current subscription
   * @returns subscription
   */
  @Get('current-subscription')
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async getCurrentSubscription(
    @Request() req: { user: UserDocument },
  ): Promise<Stripe.Subscription | undefined> {
    const { user } = req;
    return await this.stripeService.getCurrentSubscription(user.id);
  }
  //#endregion
}
