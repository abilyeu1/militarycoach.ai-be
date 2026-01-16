import { ICareer, IEducation, IMessages } from 'src/types/openai.interface';
export type IMockInterview = {
    message: IMessages[];
    promptDetails: MI_PromptDetails;
};
export type MI_PromptDetails = {
    name: string;
    age: number;
    branchOfService: string;
    languages: string[];
    careers: ICareer[];
    educations: IEducation[];
    professionalCertificates: string[];
    industryOfInterest: string;
    jobPositionLevel: string;
    interviewFormat: string;
    militaryRank: string;
    jobPositionTitle: string;
};
