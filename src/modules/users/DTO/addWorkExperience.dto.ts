// Class Validator imports
import { Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsNumber,
    IsString,
    IsUUID,
} from 'class-validator';
import { IsNotEmptyArray } from 'src/customDecorators/isNotEmptyArray';

export class AddWorkExperienceDto {
    @IsNotEmpty()
    @IsUUID('all')
    @Expose()
    _id: string = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

    @IsNotEmpty()
    @IsString()
    @Expose()
    careerField: string = 'Software';
  
    @IsNotEmpty()
    @IsString()
    @Expose()
    jobTitle: string = 'Software Engineer';
  
    @IsNotEmpty()
    @IsNumber()
    @Expose()
    yearsInCareerField: number = 1;
  
    @IsString({ each: true })
    @IsNotEmptyArray({ message: 'Skills must not be an empty array' })
    @Expose()
    skillsLeveragedInCareerField: string[] = ['React', 'NodeJS'];
}