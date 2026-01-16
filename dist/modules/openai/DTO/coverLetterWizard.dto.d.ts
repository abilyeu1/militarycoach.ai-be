declare class Career {
    careerField: string;
    skills: string[];
}
declare class Education {
    levelOfEducation: string;
    nameOfInstitution: string;
    degreeAndFieldOfStudy: string;
}
export declare class CoverLetterWizardDTO {
    name: string;
    age: number;
    branchOfService: string;
    languages: string[];
    careers: Career[];
    educations: Education[];
    professionalCertificates: string[];
    style: string;
    tone: string;
    jobDescription: string;
    militaryRank: string;
}
export {};
