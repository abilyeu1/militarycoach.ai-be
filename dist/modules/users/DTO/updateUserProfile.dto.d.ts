declare class WorkExperienceDto {
    _id: string;
    careerField: string;
    jobTitle: string;
    skillsLeveragedInCareerField: string[];
}
declare class EducationDto {
    _id: string;
    levelOfEducation: string;
    nameOfInstitution: string;
    degreeAndFieldOfStudy: string;
}
declare class CertificatesDto {
    _id: string;
    name: string;
}
export declare class UpdateUserProfileDto {
    workExperience?: WorkExperienceDto[];
    education?: EducationDto[];
    certificates?: CertificatesDto[];
    industryOfInterest?: string;
    jobPositionOfInterest?: string;
    jobPositionLevel?: string;
    JobLocation?: string;
    fullName?: string;
    age?: number;
    militaryRank?: string;
    branchOfService?: string;
    languages?: string[];
}
export {};
