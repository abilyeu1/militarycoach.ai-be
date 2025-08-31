import { ICareer, IEducation } from 'src/types/openai.interface';

export interface ICoverLetterWizard {
  name: string;
  age: number;
  branchOfService: string;
  languages: string[];
  careers: ICareer[];
  educations: IEducation[];
  professionalCertificates: string[];
  style: string;
  tone: string;
  jobDescription: string;
  militaryRank: string;
}
