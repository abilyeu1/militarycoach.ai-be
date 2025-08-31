import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Career {
  @IsString()
  @IsNotEmpty()
  @Expose()
  careerField: string = 'Software Engineer';

  @IsArray()
  @IsNotEmpty()
  @Expose()
  skills: string[] = ['Python', 'JavaScript', 'React'];
}

class Education {
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
  degreeAndFieldOfStudy: string = 'Computer Science';
}

export class CoverLetterWizardDTO {
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string = 'John';

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  age: number = 25;

  @IsString()
  @IsOptional()
  @Expose()
  branchOfService: string = 'Army';

  @IsArray()
  @IsNotEmpty()
  @Expose()
  languages: string[] = ['English', 'Spanish'];

  @ValidateNested({ each: true })
  @Type(() => Career)
  @IsArray()
  @IsNotEmpty()
  @Expose()
  careers: Career[];

  @ValidateNested({ each: true })
  @Type(() => Education)
  @IsArray()
  @Expose()
  educations: Education[];

  @IsArray()
  @IsNotEmpty()
  @Expose()
  professionalCertificates: string[] = ['AWS', 'Google Cloud'];

  @IsString()
  @IsNotEmpty()
  @Expose()
  style: string = 'creative';

  @IsString()
  @IsNotEmpty()
  @Expose()
  tone: string = 'humble';

  @IsString()
  @IsNotEmpty()
  @Expose()
  jobDescription: string = 'Software Engineer';

  @IsString()
  @IsNotEmpty()
  @Expose()
  militaryRank: string = 'E-5';
}
