import { STRIPE_SUBSCRIPTION_STATUS } from 'src/types/enums/user.enum';

export interface IQuery {
    email?: {
      $regex: string;
      $options: string;
    };
    isAdmin: boolean;
    stripeSubscriptionStatus?: STRIPE_SUBSCRIPTION_STATUS;
  }