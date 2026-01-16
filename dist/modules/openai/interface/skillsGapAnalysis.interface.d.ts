import { ICareer, IEducation, IMessages } from 'src/types/openai.interface';
export type ISkillsGapAnalysis = {
    message: IMessages[];
    promptDetails: SGA_PromptDetails;
};
export type SGA_PromptDetails = {
    name: string;
    age: number;
    branchOfService: string;
    languages: string[];
    careers: ICareer[];
    educations: IEducation[];
    professionalCertificates: string[];
    industryOfInterest: string;
    jobPositionLevel: string;
    monthsUntilSeparation: number;
    jobTitle: string;
    militaryRank: string;
};
