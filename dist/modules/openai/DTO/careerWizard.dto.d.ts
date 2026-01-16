declare class Career {
    careerField: string;
    skills: string[];
}
declare class Education {
    levelOfEducation: string;
    nameOfInstitution: string;
    degreeAndFieldOfStudy: string;
}
declare class Message {
    role: string;
    content: string;
}
declare class CW_PromptDetails {
    name: string;
    age: number;
    branchOfService: string;
    languages: string[];
    careers: Career[];
    educations: Education[];
    professionalCertificates: string[];
    industryOfInterest?: string;
    jobLocation: string;
    militaryRank: string;
}
export declare class CareerWizardDTO {
    message: Message[];
    promptDetails: CW_PromptDetails;
}
export {};
