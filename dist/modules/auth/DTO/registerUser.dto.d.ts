import { UserTypes } from 'src/types/enums/user.enum';
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
export declare class RegisterUserDto {
    email: string;
    password: string;
    type: UserTypes;
    profilePicture: string;
    fullName: string;
    age: number;
    militaryRank: string;
    branchOfService: string;
    languages: string[];
    workExperience: WorkExperienceDto[];
    industryOfInterest?: string;
    jobPositionOfInterest?: string;
    jobPositionLevel?: string;
    JobLocation?: string;
    education?: EducationDto[];
    certificates?: CertificatesDto[];
    isAdmin: boolean;
}
export {};
