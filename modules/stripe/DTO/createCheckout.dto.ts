// Class Validator imports
import { Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CheckoutSessionDTO {
    @IsNotEmpty()
    @IsString()
    @Expose()
    customerID: string = 'cus_Opa4a1GRV69Ybc';
    
    @IsNotEmpty()
    @IsString()
    @Expose()
    priceId: string = 'price_1O0MoQLspbC59PauhFmJ5RY8';
}