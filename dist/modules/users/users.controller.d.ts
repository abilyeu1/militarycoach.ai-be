import { UserService } from './user.service';
import { AddEducationDto } from './DTO/addEducation.dto';
import { AddCertificateDto } from './DTO/addCertificate.dto';
import { AddWorkExperienceDto } from './DTO/addWorkExperience.dto';
import { UpdateCareerAspirationDto } from './DTO/updateCareerAspiration.dto';
import { ExtendedRequest } from 'src/utils/Templates/extented-request.interface';
import IUser from './interface/user.interface';
import { UpdateUserProfileDto } from './DTO/updateUserProfile.dto';
import { AskForSupportDTO } from './DTO/askForSupport.dto';
export declare class UsersController {
    private userService;
    constructor(userService: UserService);
    updateUserProfile(userProfile: UpdateUserProfileDto, req: ExtendedRequest): Promise<{
        message: string;
        user: IUser;
    }>;
    getUserProfile(req: ExtendedRequest): Promise<{
        user: IUser;
    }>;
    checkEmail(email: string): Promise<{
        message: string;
        status: number;
    }>;
    updateEducation(educationDocument: AddEducationDto, req: ExtendedRequest): Promise<any>;
    addEducation(educationDocument: AddEducationDto, req: ExtendedRequest): Promise<any>;
    getEducationById(edu_id: string, req: ExtendedRequest): Promise<any>;
    getEducations(req: ExtendedRequest): Promise<any>;
    deleteEducation(edu_id: string, req: ExtendedRequest): Promise<any>;
    updateCertificate(certificateDocument: AddCertificateDto, req: ExtendedRequest): Promise<any>;
    addCertificate(certificateDocument: AddCertificateDto, req: ExtendedRequest): Promise<any>;
    getCertificateById(certificate_id: string, req: ExtendedRequest): Promise<any>;
    getCertificates(req: ExtendedRequest): Promise<any>;
    deleteCertificate(certificate_id: string, req: ExtendedRequest): Promise<any>;
    updateWorkExperience(workExperienceDocument: AddWorkExperienceDto, req: ExtendedRequest): Promise<any>;
    addWorkExperience(workExperienceDocument: AddWorkExperienceDto, req: ExtendedRequest): Promise<any>;
    getWorkExperienceById(workExp_id: string, req: ExtendedRequest): Promise<any>;
    getWorkExperience(req: ExtendedRequest): Promise<any>;
    deleteWorkExperience(workExp_id: string, req: ExtendedRequest): Promise<any>;
    updateCareerAspiration(careerDocument: UpdateCareerAspirationDto, req: ExtendedRequest): Promise<{
        message: string;
    }>;
    userSupport(body: AskForSupportDTO, req: ExtendedRequest): Promise<{
        message: string;
        support: import("./interface/support.interface").default;
    }>;
}
