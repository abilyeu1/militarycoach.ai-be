import { SupportStatus } from 'src/types/enums/common.enum';
export interface ISupportQuery {
    email?: {
        $regex: string;
        $options: string;
    };
    status?: SupportStatus;
}
