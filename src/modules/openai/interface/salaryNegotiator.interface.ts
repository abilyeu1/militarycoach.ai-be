import { ICareer, IEducation, IMessages } from 'src/types/openai.interface';

export type ISalaryNegotiator = {
  message: IMessages[];
  promptDetails: SN_PromptDetails;
};

export type SN_PromptDetails = {
  name: string;
  age: number;
  branchOfService: string;
  languages: string[];
  careers: ICareer[];
  educations: IEducation[];
  professionalCertificates: string[];
  militaryRank: string;
  salaryOffered: number;
  location: string;
  positionTitle: string;
  levelInOrganization?: string;
  companyName?: string;
};
