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
  IsNotEmptyObject,
  IsUUID,
} from 'class-validator';
import { IsNotEmptyArray } from 'src/customDecorators/isNotEmptyArray';

class WorkExperienceDto {
  @IsUUID('all')
  @IsNotEmpty()
  @Expose()
  _id: string = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

  @IsString()
  @IsNotEmpty()
  @Expose()
  careerField: string = 'Software';

  @IsString()
  @IsNotEmpty()
  @Expose()
  jobTitle: string = 'Software Engineer';

  @IsString({ each: true })
  @IsNotEmptyArray({ message: 'Skills must not be an empty array' })
  @Expose()
  skillsLeveragedInCareerField: string[] = ['React', 'NodeJS'];
}

class EducationDto {
  @IsUUID('all')
  @IsNotEmpty()
  @Expose()
  _id: string = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

  @IsString()
  @IsNotEmpty()
  @Expose()
  levelOfEducation: string = 'Bachelor';

  @IsString()
  @IsNotEmpty()
  @Expose()
  nameOfInstitution: string = 'University of California, Berkeley';

  @IsString()
  @IsNotEmpty()
  @Expose()
  degreeAndFieldOfStudy: string = 'B.S. Computer Science';
}

class CertificatesDto {
  @IsUUID('all')
  @IsNotEmpty()
  @Expose()
  _id: string = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string = 'AWS Certified Developer - Associate';
}

export class UpdateUserProfileDto {
  @IsNotEmptyArray({ message: 'workExperience must not be an empty array' })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  @Expose()
  workExperience?: WorkExperienceDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  @Expose()
  education?: EducationDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CertificatesDto)
  @Expose()
  certificates?: CertificatesDto[];

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

  @IsOptional()
  @IsString()
  @Expose()
  fullName?: string = 'Ali Raza';

  @IsOptional()
  @IsNumber()
  @Expose()
  age?: number ;

  @IsOptional()
  @IsString()
  @Expose()
  militaryRank?: string = 'Sergeant';

  @IsOptional()
  @IsString()
  @Expose()
  branchOfService?: string = 'Army';

  @IsOptional()
  @IsString({ each: true })
  @Expose()
  languages?: string[] = ['English'];
}
