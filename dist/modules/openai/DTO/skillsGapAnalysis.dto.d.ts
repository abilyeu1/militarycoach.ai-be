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
declare class SGA_PromptDetails {
    name: string;
    age: number;
    branchOfService: string;
    languages: string[];
    careers: Career[];
    educations: Education[];
    professionalCertificates: string[];
    industryOfInterest: string;
    jobPositionLevel: string;
    monthsUntilSeparation: number;
    jobTitle: string;
    militaryRank: string;
}
export declare class SkillsGapAnalysisDTO {
    message: Message[];
    promptDetails: SGA_PromptDetails;
}
export {};
