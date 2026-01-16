// Class Validator imports
import { Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ManageSubscriptionDTO {
    @IsNotEmpty()
    @IsString()
    @Expose()
    customerID: string = 'cus_Opa4a1GRV69Ybc';
    
    @IsNotEmpty()
    @IsString()
    @Expose()
    subscriptionID: string = 'sub_1O3ME1LspbC59PauFPwgiBHW';
}