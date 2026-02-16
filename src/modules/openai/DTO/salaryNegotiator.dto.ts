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
  content: string = 'What salary should I negotiate for?';
}

class SN_PromptDetails {
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

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  salaryOffered: number = 75000;

  @IsString()
  @IsNotEmpty()
  @Expose()
  location: string = 'Austin, TX';

  @IsString()
  @IsNotEmpty()
  @Expose()
  positionTitle: string = 'Project Manager';

  @IsString()
  @IsOptional()
  @Expose()
  levelInOrganization?: string = 'Mid-Level';

  @IsString()
  @IsOptional()
  @Expose()
  companyName?: string = '';
}

export class SalaryNegotiatorDTO {
  message: Message[] = [
    {
      role: 'user',
      content: 'What salary should I negotiate for?',
    },
  ];

  promptDetails: SN_PromptDetails;
}
