import { Expose, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { IsNotEmptyArray } from 'src/customDecorators/isNotEmptyArray';
import { Stripe_Price_Intervals } from 'src/types/enums/common.enum';

class featuresDTO {
    @IsString()
    @Expose()
    name: string = 'Test1';
}

export class updateProductDTO {
    @IsNotEmpty()
    @IsString()
    @Expose()
    name: string = 'Gold Special';

    @IsNotEmpty()
    @IsString()
    @Expose()
    description: string = 'Product Description';

    @IsNotEmptyArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => featuresDTO)
    @Expose()
    features: featuresDTO[];
 
}
