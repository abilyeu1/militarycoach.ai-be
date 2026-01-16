"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../schemas/users/user.schema");
const support_schema_1 = require("../../schemas/support/support.schema");
const user_enum_1 = require("../../types/enums/user.enum");
let UserService = class UserService {
    constructor(userModel, supportModel) {
        this.userModel = userModel;
        this.supportModel = supportModel;
    }
    async updateUserProfile(user_id, userProfile) {
        try {
            if (userProfile.workExperience &&
                userProfile.workExperience.length === 0) {
                throw new common_1.HttpException('Work Experience array can not be empty', common_1.HttpStatus.BAD_REQUEST);
            }
            const isUserExist = await this.userModel.findById(user_id);
            if (!isUserExist) {
                throw new common_1.HttpException('User does not Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            if (Array.isArray(userProfile.workExperience)) {
                isUserExist.workExperience = userProfile.workExperience;
            }
            else if (Array.isArray(userProfile.certificates) &&
                Array.isArray(userProfile.education)) {
                isUserExist.certificates = userProfile.certificates;
                isUserExist.education = userProfile.education;
            }
            else if (userProfile.industryOfInterest !== undefined &&
                userProfile.jobPositionLevel !== undefined &&
                userProfile.jobPositionOfInterest !== undefined &&
                userProfile.JobLocation !== undefined) {
                isUserExist.industryOfInterest = userProfile.industryOfInterest;
                isUserExist.jobPositionLevel = userProfile.jobPositionLevel;
                isUserExist.jobPositionOfInterest = userProfile.jobPositionOfInterest;
                isUserExist.JobLocation = userProfile.JobLocation;
            }
            else if (userProfile.fullName !== undefined &&
                userProfile.age !== undefined &&
                userProfile.branchOfService !== undefined &&
                userProfile.militaryRank !== undefined &&
                Array.isArray(userProfile.languages)) {
                isUserExist.fullName = userProfile.fullName;
                isUserExist.age = userProfile.age;
                isUserExist.languages = userProfile.languages;
                isUserExist.branchOfService = userProfile.branchOfService;
                isUserExist.militaryRank = userProfile.militaryRank;
            }
            else {
                throw new common_1.HttpException('Input body format is not correct', common_1.HttpStatus.BAD_REQUEST);
            }
            const areFieldsEmpty = !isUserExist.industryOfInterest ||
                !isUserExist.jobPositionOfInterest ||
                !isUserExist.jobPositionLevel ||
                !isUserExist.education ||
                !isUserExist.certificates ||
                !isUserExist.fullName ||
                !isUserExist.age ||
                !isUserExist.languages ||
                !isUserExist.branchOfService ||
                !isUserExist.militaryRank ||
                isUserExist.education.length === 0 ||
                isUserExist.certificates.length === 0 ||
                isUserExist.languages.length === 0;
            isUserExist.profileStatus = areFieldsEmpty ? 'incomplete' : 'complete';
            const updatedUser = await this.userModel.findOneAndUpdate({ _id: user_id }, isUserExist, { new: true, upsert: true });
            return {
                message: 'User Profile updated successfully',
                user: updatedUser,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserProfile(user_id) {
        try {
            return await this.userModel.findById(user_id);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async checkEmail(email) {
        try {
            const isEmailExist = await this.userModel.findOne({ email: email });
            if (isEmailExist) {
                throw new common_1.HttpException('Email already exist', common_1.HttpStatus.CONFLICT);
            }
            return {
                status: common_1.HttpStatus.OK,
                message: 'Email is available',
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.CONFLICT);
        }
    }
    async addEducation(user_id, educationDocument) {
        try {
            const isUserExist = await this.userModel.findById(user_id);
            if (!isUserExist) {
                throw new common_1.HttpException('User does not Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            const isEducationExist = isUserExist.education.some((edu) => edu._id === educationDocument._id);
            if (isEducationExist) {
                throw new common_1.HttpException('Education Already Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            isUserExist.education.push(educationDocument);
            const updatedUser = await isUserExist.save();
            const userAfterUpdate = await this.updateProfileStatus(user_id);
            return {
                user: userAfterUpdate,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEducations(user_id) {
        try {
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.EDUCATION);
            return {
                education: userById.education,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEducationById(user_id, edu_id) {
        try {
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.EDUCATION);
            const educationById = userById.education
                .map((item) => {
                if (item._id === edu_id) {
                    return item;
                }
                return null;
            })
                .filter((item) => item !== null);
            if (educationById.length === 0) {
                throw new common_1.HttpException('Education by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                education: educationById,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateEducation(user_id, educationDocument) {
        try {
            const { _id } = educationDocument;
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.EDUCATION);
            var flag = false;
            const updateEducation = userById.education.map((item) => {
                if (item._id === _id) {
                    flag = true;
                    return educationDocument;
                }
                return item;
            });
            if (!flag) {
                throw new common_1.HttpException('Education by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            userById.education = updateEducation;
            const updateUser = await userById.save();
            return {
                updatedEducation: updateUser.education,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteEducation(user_id, edu_id) {
        try {
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.EDUCATION);
            var flag = false;
            const updateEducation = userById.education
                .map((item) => {
                if (item._id === edu_id) {
                    flag = true;
                    return null;
                }
                return item;
            })
                .filter((item) => item !== null);
            if (!flag) {
                throw new common_1.HttpException('Education by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            userById.education = updateEducation;
            const updateUser = await userById.save();
            const userAfterUpdate = await this.updateProfileStatus(user_id);
            return {
                msg: 'Education by id is deleted successfuly',
                user: userAfterUpdate,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addCertificate(user_id, certificateDocument) {
        try {
            const isUserExist = await this.userModel.findById(user_id);
            if (!isUserExist) {
                throw new common_1.HttpException('User does not Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            const isCertificateExist = isUserExist.certificates.some((certificate) => certificate._id === certificateDocument._id);
            if (isCertificateExist) {
                throw new common_1.HttpException('Certificate Already Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            isUserExist.certificates.push(certificateDocument);
            const updatedUser = await isUserExist.save();
            const userAfterUpdate = await this.updateProfileStatus(user_id);
            return {
                user: userAfterUpdate,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCertificates(user_id) {
        try {
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.CERTIFICATES);
            return {
                certificates: userById.certificates,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCertificateById(user_id, certificate_id) {
        try {
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.CERTIFICATES);
            const certificateById = userById.certificates
                .map((item) => {
                if (item._id === certificate_id) {
                    return item;
                }
                return null;
            })
                .filter((item) => item !== null);
            if (certificateById.length === 0) {
                throw new common_1.HttpException('Certificate by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                certificate: certificateById,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCertificate(user_id, certificateDocument) {
        try {
            const { _id } = certificateDocument;
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.CERTIFICATES);
            var flag = false;
            const updateCertificate = userById.certificates.map((item) => {
                if (item._id === _id) {
                    flag = true;
                    return certificateDocument;
                }
                return item;
            });
            if (!flag) {
                throw new common_1.HttpException('Certificate by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            userById.certificates = updateCertificate;
            const updateUser = await userById.save();
            return {
                updatedCertificates: updateUser.certificates,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteCertificate(user_id, certificate_id) {
        try {
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.CERTIFICATES);
            var flag = false;
            const updateCertificate = userById.certificates
                .map((item) => {
                if (item._id === certificate_id) {
                    flag = true;
                    return null;
                }
                return item;
            })
                .filter((item) => item !== null);
            if (!flag) {
                throw new common_1.HttpException('Certificates by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            userById.certificates = updateCertificate;
            const updateUser = await userById.save();
            const userAfterUpdate = await this.updateProfileStatus(user_id);
            return {
                msg: 'Certificate by id is deleted successfuly',
                user: userAfterUpdate,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async addWorkExperience(user_id, workExperienceDocument) {
        try {
            const isUserExist = await this.userModel.findById(user_id);
            if (!isUserExist) {
                throw new common_1.HttpException('User does not Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            const isWorkExperienceExist = isUserExist.workExperience.some((workExp) => workExp._id === workExperienceDocument._id);
            if (isWorkExperienceExist) {
                throw new common_1.HttpException('Work Experience Already Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            isUserExist.workExperience.push(workExperienceDocument);
            const updatedUser = await isUserExist.save();
            return {
                updatedWorkExperience: updatedUser.workExperience,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getWorkExperience(user_id) {
        try {
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.WORK_EXPERIENCE);
            return {
                workExperience: userById.workExperience,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getWorkExperienceById(user_id, workExp_id) {
        try {
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.WORK_EXPERIENCE);
            const workExperienceById = userById.workExperience
                .map((item) => {
                if (item._id === workExp_id) {
                    return item;
                }
                return null;
            })
                .filter((item) => item !== null);
            if (workExperienceById.length === 0) {
                throw new common_1.HttpException('Work Experience by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                workExperience: workExperienceById,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateWorkExperience(user_id, workExperienceDocument) {
        try {
            const { _id } = workExperienceDocument;
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.WORK_EXPERIENCE);
            var flag = false;
            const updateWorkExperience = userById.workExperience.map((item) => {
                if (item._id === _id) {
                    flag = true;
                    return workExperienceDocument;
                }
                return item;
            });
            if (!flag) {
                throw new common_1.HttpException('Work Experience by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            userById.workExperience = updateWorkExperience;
            const updateUser = await userById.save();
            return {
                updatedWorkExperience: updateUser.workExperience,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteWorkExperience(user_id, workExp_id) {
        try {
            const userById = await this.validateUser(user_id, user_enum_1.FOR_ARRAY.WORK_EXPERIENCE);
            var flag = false;
            const updateWorkExperience = userById.workExperience
                .map((item) => {
                if (item._id === workExp_id) {
                    flag = true;
                    return null;
                }
                return item;
            })
                .filter((item) => item !== null);
            if (!flag) {
                throw new common_1.HttpException('Work Experience by Id not found', common_1.HttpStatus.NOT_FOUND);
            }
            userById.workExperience = updateWorkExperience;
            const updateUser = await userById.save();
            return {
                msg: 'Work Experience by id is deleted successfuly',
                workExperience: updateUser.workExperience,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCareerAspiration(user_id, careerDocument) {
        try {
            const userById = await this.userModel.findById(user_id);
            if (!userById) {
                throw new common_1.HttpException('User does not Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            userById.industryOfInterest = careerDocument.industryOfInterest;
            userById.jobPositionOfInterest = careerDocument.jobPositionOfInterest;
            userById.jobPositionLevel = careerDocument.jobPositionLevel;
            userById.JobLocation = careerDocument.JobLocation;
            const updateUser = await userById.save();
            const userAfterUpdate = await this.updateProfileStatus(user_id);
            return {
                message: 'Career Aspiration updated successfully',
                user: userAfterUpdate,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateUser(user_id, forArray) {
        try {
            const userById = await this.userModel.findById(user_id);
            if (!userById) {
                throw new common_1.HttpException('User does not Exist', common_1.HttpStatus.BAD_REQUEST);
            }
            switch (forArray) {
                case user_enum_1.FOR_ARRAY.WORK_EXPERIENCE:
                    if (userById.workExperience.length === 0) {
                        throw new common_1.HttpException('Work Experience array is empty', common_1.HttpStatus.NOT_FOUND);
                    }
                    return userById;
                case user_enum_1.FOR_ARRAY.EDUCATION:
                    if (userById.education.length === 0) {
                        throw new common_1.HttpException('Education array is empty', common_1.HttpStatus.NOT_FOUND);
                    }
                    return userById;
                case user_enum_1.FOR_ARRAY.CERTIFICATES:
                    if (userById.certificates.length === 0) {
                        throw new common_1.HttpException('Certificates array is empty', common_1.HttpStatus.NOT_FOUND);
                    }
                    return userById;
                default:
                    throw new common_1.HttpException('Something went wrong', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateProfileStatus(user_id) {
        try {
            const userExist = await this.userModel.findById(user_id);
            const areFieldsEmpty = !userExist.industryOfInterest ||
                !userExist.jobPositionOfInterest ||
                !userExist.jobPositionLevel ||
                !userExist.education ||
                !userExist.certificates ||
                userExist.education.length === 0 ||
                userExist.certificates.length === 0;
            const updateData = {
                profileStatus: areFieldsEmpty ? 'incomplete' : 'complete',
            };
            const updatedUser = await this.userModel.findOneAndUpdate({ _id: user_id }, updateData, { new: true, upsert: true });
            return updatedUser;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async askForSupport(user_id, body) {
        try {
            const userExist = await this.userModel.findById(user_id);
            if (!userExist) {
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const { email, fullName } = userExist;
            const createSupport = await this.supportModel.create({
                name: fullName,
                email,
                question: body.question,
            });
            const newSupport = await createSupport.save();
            return {
                message: 'New support added by the user',
                support: newSupport,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(support_schema_1.Support.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map