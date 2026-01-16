import { Document } from 'mongoose';
import { StripeStatus, SupportStatus } from 'src/types/enums/common.enum';
import { SHEER_ID_STATUS, UserTypes } from 'src/types/enums/user.enum';

interface ISupport extends Document {
  name: string;
  question: string;
  reply: string;
  status: SupportStatus;
  email: string;

}

export default ISupport;
