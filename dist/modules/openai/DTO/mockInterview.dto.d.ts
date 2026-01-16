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
declare class MI_PromptDetails {
    name: string;
    age: number;
    branchOfService: string;
    languages: string[];
    careers: Career[];
    educations: Education[];
    professionalCertificates: string[];
    industryOfInterest: string;
    jobPositionLevel: string;
    interviewFormat: string;
    militaryRank: string;
    jobPositionTitle: string;
}
export declare class MockInterviewDTO {
    message: Message[];
    promptDetails: MI_PromptDetails;
}
export {};
