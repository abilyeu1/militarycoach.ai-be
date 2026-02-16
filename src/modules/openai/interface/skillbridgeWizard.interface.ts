import { ICareer, IEducation, IMessages } from 'src/types/openai.interface';

export type ISkillbridgeWizard = {
  message: IMessages[];
  promptDetails: SB_PromptDetails;
};

export type SB_PromptDetails = {
  name: string;
  age: number;
  branchOfService: string;
  languages: string[];
  careers: ICareer[];
  educations: IEducation[];
  professionalCertificates: string[];
  militaryRank: string;
  desiredCareerField1?: string;
  desiredCareerField2?: string;
  desiredLocation?: string;
};

export interface SkillBridgeOpportunity {
  title: string;
  company: string;
  location: string;
  description: string;
  link: string;
  source: string;
}
