import { SupportStatus } from 'src/types/enums/common.enum';
import { STRIPE_SUBSCRIPTION_STATUS } from 'src/types/enums/user.enum';

export interface ISupportQuery {
    email?: {
      $regex: string;
      $options: string;
    };
    status?: SupportStatus;
}