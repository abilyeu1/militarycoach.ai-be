import { Expose, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, MAX, Max, Min, ValidateNested } from 'class-validator';
import { IsNotEmptyArray } from 'src/customDecorators/isNotEmptyArray';
import { Stripe_Price_Intervals } from 'src/types/enums/common.enum';

class featuresDTO {
    @IsString()
    @Expose()
    name: string = 'Test1';
}

export class addProductDTO {
    @IsNotEmpty()
    @IsString()
    @Expose()
    name: string = 'Gold Special';

    @IsNotEmptyArray()
    @ValidateNested({ each: true })
    @Type(() => featuresDTO)
    @Expose()
    features: featuresDTO[];

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    unit_amount: number = 100;

    @IsNotEmpty()
    @IsString()
    @Expose()
    description: string = 'Product Description';

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(12)
    @Expose()
    interval_count: number = 12
 
}
