/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/users/user.schema';
import { SupportDocument } from 'src/schemas/support/support.schema';
import { AddEducationDto } from './DTO/addEducation.dto';
import { AddCertificateDto } from './DTO/addCertificate.dto';
import { AddWorkExperienceDto } from './DTO/addWorkExperience.dto';
import { UpdateCareerAspirationDto } from './DTO/updateCareerAspiration.dto';
import { AskForSupportDTO } from './DTO/askForSupport.dto';
import { UpdateUserProfileDto } from './DTO/updateUserProfile.dto';
import IAddEducation from './interface/addEducation.interface';
import IAddCertificate from './interface/addCertificate.interface';
import IAddWorkExperience from './interface/addWorkExperience.interface';
import IUser from './interface/user.interface';
import ISupport from './interface/support.interface';
import { FOR_ARRAY } from 'src/types/enums/user.enum';
export declare class UserService {
    private userModel;
    private supportModel;
    constructor(userModel: Model<UserDocument>, supportModel: Model<SupportDocument>);
    updateUserProfile(user_id: string, userProfile: UpdateUserProfileDto): Promise<{
        message: string;
        user: IUser;
    }>;
    getUserProfile(user_id: string): Promise<{
        user: IUser;
    }>;
    checkEmail(email: string): Promise<{
        message: string;
        status: number;
    }>;
    addEducation(user_id: string, educationDocument: AddEducationDto): Promise<IAddEducation[] | any>;
    getEducations(user_id: string): Promise<IAddEducation[] | any>;
    getEducationById(user_id: string, edu_id: string): Promise<IAddEducation[] | any>;
    updateEducation(user_id: string, educationDocument: AddEducationDto): Promise<IAddEducation[] | any>;
    deleteEducation(user_id: string, edu_id: string): Promise<IAddEducation[] | any>;
    addCertificate(user_id: string, certificateDocument: AddCertificateDto): Promise<IAddCertificate | any>;
    getCertificates(user_id: string): Promise<IAddCertificate | any>;
    getCertificateById(user_id: string, certificate_id: string): Promise<IAddCertificate | any>;
    updateCertificate(user_id: string, certificateDocument: AddCertificateDto): Promise<IAddCertificate | any>;
    deleteCertificate(user_id: string, certificate_id: string): Promise<IAddCertificate | any>;
    addWorkExperience(user_id: string, workExperienceDocument: AddWorkExperienceDto): Promise<IAddWorkExperience | any>;
    getWorkExperience(user_id: string): Promise<IAddWorkExperience | any>;
    getWorkExperienceById(user_id: string, workExp_id: string): Promise<IAddWorkExperience | any>;
    updateWorkExperience(user_id: string, workExperienceDocument: AddWorkExperienceDto): Promise<IAddWorkExperience | any>;
    deleteWorkExperience(user_id: string, workExp_id: string): Promise<IAddWorkExperience | any>;
    updateCareerAspiration(user_id: string, careerDocument: UpdateCareerAspirationDto): Promise<{
        message: string;
    } | any>;
    validateUser(user_id: string, forArray: FOR_ARRAY): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    updateProfileStatus(user_id: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    }> & import("mongoose").Document<unknown, {}, User> & User & {
        _id: import("mongoose").Types.ObjectId;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    askForSupport(user_id: string, body: AskForSupportDTO): Promise<{
        message: string;
        support: ISupport;
    }>;
}
