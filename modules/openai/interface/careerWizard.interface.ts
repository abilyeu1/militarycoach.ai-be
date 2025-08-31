import { ICareer, IEducation, IMessages } from 'src/types/openai.interface';

export type ICareerWizard = {
  message: IMessages[];
  promptDetails: PromptDetails;
};

export type PromptDetails = {
  name: string;
  age: number;
  branchOfService: string;
  languages: string[];
  careers: ICareer[];
  educations: IEducation[];
  professionalCertificates: string[];
  industryOfInterest?: string;
  jobLocation?: string;
  militaryRank?: string;
};
