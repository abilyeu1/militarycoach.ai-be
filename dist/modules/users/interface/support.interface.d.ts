import { Document } from 'mongoose';
import { SupportStatus } from 'src/types/enums/common.enum';
interface ISupport extends Document {
    name: string;
    question: string;
    reply: string;
    status: SupportStatus;
    email: string;
}
export default ISupport;
