// Class Validator imports
import { Prop } from '@nestjs/mongoose';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { IsNotEmptyArray } from 'src/customDecorators/isNotEmptyArray';

// Type & Schema imports
import { UserTypes } from 'src/types/enums/user.enum';

class WorkExperienceDto {
  @IsUUID('all')
  @Expose()
  _id: string = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

  @IsString()
  @Expose()
  careerField: string = 'Software';

  @IsString()
  @Expose()
  jobTitle: string = 'Software Engineer';

  @IsString({ each: true })
  @IsNotEmptyArray({ message: 'Skills must not be an empty array' })
  @Expose()
  skillsLeveragedInCareerField: string[] = ['React', 'NodeJS'];
}

class EducationDto {
  @IsUUID('all')
  @Expose()
  _id: string = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

  @IsString()
  @Expose()
  levelOfEducation: string = 'Bachelor';

  @IsString()
  @Expose()
  nameOfInstitution: string = 'University of California, Berkeley';

  @IsString()
  @Expose()
  degreeAndFieldOfStudy: string = 'B.S. Computer Science';
}

class CertificatesDto {
  @IsUUID('all')
  @Expose()
  _id: string = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

  @IsString()
  @Expose()
  name: string = 'AWS Certified Developer - Associate';
}

export class RegisterUserDto {
  // =================================== User Basic Details ===================================

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string = 'ali@zenkoders.com';

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?!\s*$).+/, { message: 'White spaces not allowed' })
  @Expose()
  password: string = '123123';

  @IsNotEmpty()
  @IsEnum(UserTypes)
  @Expose()
  type: UserTypes = UserTypes.CIVILIAN;

  @IsString()
  @Expose()
  profilePicture: string = '';

  // =================================== Personal Details ===================================

  @IsNotEmpty()
  @IsString()
  @Expose()
  fullName: string = 'Ali Raza';

  @IsNumber()
  @Prop({ required: false })
  @Expose()
  age: number = 22;

  @IsNotEmpty()
  @IsString()
  @Expose()
  militaryRank: string = 'Sergeant';

  @IsNotEmpty()
  @IsString()
  @Expose()
  branchOfService: string = 'Army';

  @IsNotEmptyArray({ message: 'languages must not be an empty array' })
  @IsString({ each: true })
  languages: string[] = ['English'];

  // =================================== Work Experience ===================================

  @IsNotEmptyArray({ message: 'workExperience must not be an empty array' })
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  @Expose()
  workExperience: WorkExperienceDto[];

  // =================================== Career Aspiration ===================================

  @IsOptional()
  @IsString()
  @Expose()
  industryOfInterest?: string = 'Software';

  @IsOptional()
  @IsString()
  @Expose()
  jobPositionOfInterest?: string = 'Software Engineer';

  @IsOptional()
  @IsString()
  @Expose()
  jobPositionLevel?: string = 'Entry Level';

  @IsOptional()
  @IsString()
  @Expose()
  JobLocation?: string = 'Houston, TX';

  // =================================== Education ===================================

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  @Expose()
  education?: EducationDto[];

  // =================================== Certificates ===================================

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CertificatesDto)
  @Expose()
  certificates?: CertificatesDto[];

  // =================================== Additional Keys ===================================

  @IsBoolean()
  @Expose()
  isAdmin: boolean = false;
}
