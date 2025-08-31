// Class Validator imports
import { Expose } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsUUID,
} from 'class-validator';

export class AddCertificateDto {
    @IsNotEmpty()
    @IsUUID('all')
    @Expose()
    _id: string = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6b';
    
    @IsNotEmpty()
    @IsString()
    @Expose()
    name: string = 'AWS Certified Developer - Associate';
}