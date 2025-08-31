// Class Validator imports
import { Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateCareerAspirationDto {

    @IsNotEmpty()
    @IsString()
    @Expose()
    industryOfInterest: string = 'Software';

    @IsNotEmpty()
    @IsString()
    @Expose()
    jobPositionOfInterest: string = 'Software Engineer';

    @IsNotEmpty()
    @IsString()
    @Expose()
    jobPositionLevel: string = 'Entry Level';

    @IsOptional()
    @IsString()
    @Expose()
    JobLocation?: string = 'Houston, TX';
}