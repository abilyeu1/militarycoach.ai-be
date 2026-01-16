import { IEducation, IMessages } from 'src/types/openai.interface';

export type IRecommendIndustry = {
  message: IMessages[];
  promptDetails: RI_PromptDetails;
};

export type RI_PromptDetails = {
  name: string;
  age: number;
  branchOfService: string;
  languages: string[];
  careers: {
    _id: string;
    careerField: string;
    jobTitle: string;
    skillsLeveragedInCareerField: string[];
  }[];
  professionalCertificates: {
    _id: string;
    name: string;
  }[];
  educations: IEducation[];
};
