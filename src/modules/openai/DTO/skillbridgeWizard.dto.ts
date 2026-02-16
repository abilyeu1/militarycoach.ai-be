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

class Message {
  @IsString()
  @IsNotEmpty()
  @Expose()
  role: string = 'user';

  @IsString()
  @IsNotEmpty()
  @Expose()
  content: string = 'Find SkillBridge opportunities for me';
}

class SB_PromptDetails {
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
  militaryRank: string = 'E-5';

  @IsString()
  @IsOptional()
  @Expose()
  desiredCareerField1?: string = '';

  @IsString()
  @IsOptional()
  @Expose()
  desiredCareerField2?: string = '';

  @IsString()
  @IsOptional()
  @Expose()
  desiredLocation?: string = '';
}

export class SkillbridgeWizardDTO {
  message: Message[] = [
    {
      role: 'user',
      content: 'Find SkillBridge opportunities for me',
    },
  ];

  promptDetails: SB_PromptDetails;
}
