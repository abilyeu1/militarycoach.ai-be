// Nest JS Imports
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// NPM Package Imports
import axios from 'axios';

// Mongoose Imports
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Service Imports
import { OpenaiService } from '../openai/openai.service';

// Schema Imports
import { User, UserDocument } from 'src/schemas/users/user.schema';
import { Support, SupportDocument } from 'src/schemas/support/support.schema';

// DTO Imports
import { AddEducationDto } from './DTO/addEducation.dto';
import { AddCertificateDto } from './DTO/addCertificate.dto';
import { AddWorkExperienceDto } from './DTO/addWorkExperience.dto';
import { UpdateCareerAspirationDto } from './DTO/updateCareerAspiration.dto';
import { AskForSupportDTO } from './DTO/askForSupport.dto';
import { UpdateUserProfileDto } from './DTO/updateUserProfile.dto';

// Interfaces Imports
import IAddEducation from './interface/addEducation.interface';
import IAddCertificate from './interface/addCertificate.interface';
import IAddWorkExperience from './interface/addWorkExperience.interface';
import IUser from './interface/user.interface';
import ISupport from './interface/support.interface';

// Enum Imports
import { FOR_ARRAY } from 'src/types/enums/user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Support.name) private supportModel: Model<SupportDocument>,
  ) {}

  //#region : EDIT USER PROFILE API

  // =================== PUT: UPDATE USER PROFILE ======================
  /**
   * @description Update an user Profile details in user schema.
   * @param  {string} user_id
   * @param {UpdateUserProfileDto} userProfile - The work userProfile includes Work Experience education,  certificates and career aspiration.
   * @returns {Promise<{ message: string; user: IUser }>} Returns user array of object.
   */
  async updateUserProfile(
    user_id: string,
    userProfile: UpdateUserProfileDto,
  ): Promise<{ message: string; user: IUser }> {
    try {
      if (
        userProfile.workExperience &&
        userProfile.workExperience.length === 0
      ) {
        throw new HttpException(
          'Work Experience array can not be empty',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Check if user exists
      const isUserExist = await this.userModel.findById(user_id);
      if (!isUserExist) {
        throw new HttpException('User does not Exist', HttpStatus.BAD_REQUEST);
      }

      if (Array.isArray(userProfile.workExperience)) {
        isUserExist.workExperience = userProfile.workExperience;
      } else if (
        Array.isArray(userProfile.certificates) &&
        Array.isArray(userProfile.education)
      ) {
        isUserExist.certificates = userProfile.certificates;
        isUserExist.education = userProfile.education;
      } else if (
        userProfile.industryOfInterest !== undefined &&
        userProfile.jobPositionLevel !== undefined &&
        userProfile.jobPositionOfInterest !== undefined &&
        userProfile.JobLocation !== undefined
      ) {
        isUserExist.industryOfInterest = userProfile.industryOfInterest;
        isUserExist.jobPositionLevel = userProfile.jobPositionLevel;
        isUserExist.jobPositionOfInterest = userProfile.jobPositionOfInterest;
        isUserExist.JobLocation = userProfile.JobLocation;
      } else if (
        userProfile.fullName !== undefined &&
        userProfile.age !== undefined &&
        userProfile.branchOfService !== undefined &&
        userProfile.militaryRank !== undefined &&
        Array.isArray(userProfile.languages)
      ) {
        isUserExist.fullName = userProfile.fullName;
        isUserExist.age = userProfile.age;
        isUserExist.languages = userProfile.languages;
        isUserExist.branchOfService = userProfile.branchOfService;
        isUserExist.militaryRank = userProfile.militaryRank;
      } else {
        throw new HttpException(
          'Input body format is not correct',
          HttpStatus.BAD_REQUEST,
        );
      }

      const areFieldsEmpty =
        !isUserExist.industryOfInterest ||
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

      // Update the profileStatus
      isUserExist.profileStatus = areFieldsEmpty ? 'incomplete' : 'complete';

      const updatedUser: IUser = await this.userModel.findOneAndUpdate(
        { _id: user_id },
        isUserExist,
        { new: true, upsert: true },
      );

      return {
        message: 'User Profile updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserProfile(user_id: string): Promise<{ user: IUser }> {
    try {
      return await this.userModel.findById(user_id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkEmail(
    email: string,
  ): Promise<{ message: string; status: number }> {
    try {
      const isEmailExist = await this.userModel.findOne({ email: email });
      if (isEmailExist) {
        throw new HttpException('Email already exist', HttpStatus.CONFLICT);
      }
      return {
        status: HttpStatus.OK,
        message: 'Email is available',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  //#endregion

  //#region : EDUCATION CRUD

  // =================== POST: ADD EDUCATION ======================
  /**
   * @description Add a new education in user schema.
   * @param {AddEducationDto} educationDocument - The educationDocument includes _id, levelOfEducation, nameOfInstitution and degreeAndFieldOfStudy.
   * @returns {Promise<IAddEducation[]>} Returns updated user education array of objects.
   */
  async addEducation(
    user_id: string,
    educationDocument: AddEducationDto,
  ): Promise<IAddEducation[] | any> {
    try {
      // Check if user exists
      const isUserExist = await this.userModel.findById(user_id);

      if (!isUserExist) {
        throw new HttpException('User does not Exist', HttpStatus.BAD_REQUEST);
      }

      // Check if the education document already exists
      const isEducationExist = isUserExist.education.some(
        (edu) => edu._id === educationDocument._id,
      );

      if (isEducationExist) {
        throw new HttpException(
          'Education Already Exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Add education to the user's education array
      isUserExist.education.push(educationDocument);

      // Save the updated user
      const updatedUser = await isUserExist.save();

      const userAfterUpdate = await this.updateProfileStatus(user_id);
      return {
        user: userAfterUpdate,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== GET: GET EDUCATION ======================
  /**
   * @description To Get all the education by user.
   * @param  {string} user_id
   * @returns {Promise<IAddEducation[]>} Returns user.education array of objects.
   */
  async getEducations(user_id: string): Promise<IAddEducation[] | any> {
    try {
      const userById = await this.validateUser(user_id, FOR_ARRAY.EDUCATION);
      return {
        education: userById.education,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== GET: GET EDUCATION BY ID ======================
  /**
   * @description To Get the user education by id.
   * @param  {string} user_id
   * @param  {string} edu_id
   * @returns  {Promise<IAddEducation[]>} Returns user.education array of object by id.
   */
  async getEducationById(
    user_id: string,
    edu_id: string,
  ): Promise<IAddEducation[] | any> {
    try {
      const userById = await this.validateUser(user_id, FOR_ARRAY.EDUCATION);
      const educationById = userById.education
        .map((item) => {
          if (item._id === edu_id) {
            return item;
          }
          return null;
        })
        .filter((item) => item !== null);
      if (educationById.length === 0) {
        throw new HttpException(
          'Education by Id not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        education: educationById,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== PUT: UPDATE EDUCATION ======================
  /**
   * @description Update an education object in user schema.
   * @param  {string} user_id
   * @param {AddEducationDto} educationDocument - The educationDocument includes _id, levelOfEducation, nameOfInstitution and degreeAndFieldOfStudy.
   * @returns {Promise<IAddEducation[]>} Returns updated user education array of objects.
   */
  async updateEducation(
    user_id: string,
    educationDocument: AddEducationDto,
  ): Promise<IAddEducation[] | any> {
    try {
      const { _id } = educationDocument;
      const userById = await this.validateUser(user_id, FOR_ARRAY.EDUCATION);
      var flag = false;
      const updateEducation = userById.education.map((item) => {
        if (item._id === _id) {
          flag = true;
          return educationDocument;
        }
        return item;
      });
      if (!flag) {
        throw new HttpException(
          'Education by Id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      userById.education = updateEducation;
      // Save the updated user
      const updateUser = await userById.save();

      return {
        updatedEducation: updateUser.education,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== DELETE: Delete EDUCATION BY ID ======================
  /**
   * @description To Delete the user education by id.
   * @param  {string} user_id
   * @param  {string} edu_id
   * @returns  {Promise<IAddEducation[]>} Returns user.education array of objects.
   */
  async deleteEducation(
    user_id: string,
    edu_id: string,
  ): Promise<IAddEducation[] | any> {
    try {
      const userById = await this.validateUser(user_id, FOR_ARRAY.EDUCATION);
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
        throw new HttpException(
          'Education by Id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      userById.education = updateEducation;
      // Save the updated user
      const updateUser = await userById.save();

      const userAfterUpdate = await this.updateProfileStatus(user_id);
      return {
        msg: 'Education by id is deleted successfuly',
        user: userAfterUpdate,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : CERTIFICATES CRUD

  // =================== POST: ADD CERTIFICATES ======================
  /**
   * @description Add a new certificates in user schema.
   * @param  {string} user_id
   * @param {AddCertificateDto} certificateDocument - The certificateDocument includes _id and name.
   * @returns {Promise<IAddCertificate[]>} Returns user certificate array of objects.
   */
  async addCertificate(
    user_id: string,
    certificateDocument: AddCertificateDto,
  ): Promise<IAddCertificate | any> {
    try {
      // Check if user exists
      const isUserExist = await this.userModel.findById(user_id);
      if (!isUserExist) {
        throw new HttpException('User does not Exist', HttpStatus.BAD_REQUEST);
      }

      // Check if the certificate document already exists
      const isCertificateExist = isUserExist.certificates.some(
        (certificate) => certificate._id === certificateDocument._id,
      );
      if (isCertificateExist) {
        throw new HttpException(
          'Certificate Already Exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Add certificate to the user's certificates array
      isUserExist.certificates.push(certificateDocument);

      // Save the updated user
      const updatedUser = await isUserExist.save();

      const userAfterUpdate = await this.updateProfileStatus(user_id);
      return {
        user: userAfterUpdate,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== GET: GET CERTIFICATES ======================
  /**
   * @description To Get all the certificates by user.
   * @param  {string} user_id
   * @returns {Promise<IAddCertificate[]>} Returns  user certificate array of objects.
   */
  async getCertificates(user_id: string): Promise<IAddCertificate | any> {
    try {
      const userById = await this.validateUser(user_id, FOR_ARRAY.CERTIFICATES);
      return {
        certificates: userById.certificates,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== GET: GET CERTIFICATES BY ID ======================
  /**
   * @description To Get the user certificate by id.
   * @param  {string} user_id
   * @param  {string} certificate_id
   * @returns {Promise<IAddCertificate[]>} Returns  user certificate array of object by id.
   */
  async getCertificateById(
    user_id: string,
    certificate_id: string,
  ): Promise<IAddCertificate | any> {
    try {
      const userById = await this.validateUser(user_id, FOR_ARRAY.CERTIFICATES);
      const certificateById = userById.certificates
        .map((item) => {
          if (item._id === certificate_id) {
            return item;
          }
          return null;
        })
        .filter((item) => item !== null);

      if (certificateById.length === 0) {
        throw new HttpException(
          'Certificate by Id not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        certificate: certificateById,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== PUT: UPDATE CERTIFICATES ======================
  /**
   * @description Update an certificate object in user schema.
   * @param  {string} user_id
   * @param {AddCertificateDto} certificateDocument - The certificateDocument includes _id and name.
   * @returns {Promise<IAddCertificate[]>} Returns  user certificate array of objects.
   */
  async updateCertificate(
    user_id: string,
    certificateDocument: AddCertificateDto,
  ): Promise<IAddCertificate | any> {
    try {
      const { _id } = certificateDocument;
      const userById = await this.validateUser(user_id, FOR_ARRAY.CERTIFICATES);
      var flag = false;
      const updateCertificate = userById.certificates.map((item) => {
        if (item._id === _id) {
          flag = true;
          return certificateDocument;
        }
        return item;
      });
      if (!flag) {
        throw new HttpException(
          'Certificate by Id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      userById.certificates = updateCertificate;
      // Save the updated user
      const updateUser = await userById.save();

      return {
        updatedCertificates: updateUser.certificates,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== DELETE: Delete CERTIFICATES BY ID ======================
  /**
   * @description To Delete the user certificate by id.
   * @param  {string} user_id
   * @param  {string} certificate_id
   * @returns {Promise<IAddCertificate[]>} Returns  user certificate array of objects.
   */
  async deleteCertificate(
    user_id: string,
    certificate_id: string,
  ): Promise<IAddCertificate | any> {
    try {
      const userById = await this.validateUser(user_id, FOR_ARRAY.CERTIFICATES);
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
        throw new HttpException(
          'Certificates by Id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      userById.certificates = updateCertificate;
      // Save the updated user
      const updateUser = await userById.save();

      const userAfterUpdate = await this.updateProfileStatus(user_id);

      return {
        msg: 'Certificate by id is deleted successfuly',
        user: userAfterUpdate,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : WORK EXPERIENCE CRUD

  // =================== POST: ADD WORK EXPERIENCE ======================
  /**
   * @description Add a new work experience in user schema.
   * @param  {string} user_id
   * @param {AddWorkExperienceDto} workExperienceDocument - The workExperienceDocument includes _id, careerField, jobTitle, yearsInCareerField and skillsLeveragedInCareerField array.
   * @returns {Promise<IAddWorkExperience[]>} Returns user.workExperience array of object.
   */
  async addWorkExperience(
    user_id: string,
    workExperienceDocument: AddWorkExperienceDto,
  ): Promise<IAddWorkExperience | any> {
    try {
      // Check if user exists
      const isUserExist = await this.userModel.findById(user_id);
      if (!isUserExist) {
        throw new HttpException('User does not Exist', HttpStatus.BAD_REQUEST);
      }

      // Check if the work experience document already exists
      const isWorkExperienceExist = isUserExist.workExperience.some(
        (workExp) => workExp._id === workExperienceDocument._id,
      );
      if (isWorkExperienceExist) {
        throw new HttpException(
          'Work Experience Already Exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Add work experience to the user's workExperience array
      isUserExist.workExperience.push(workExperienceDocument);

      // Save the updated user
      const updatedUser = await isUserExist.save();

      return {
        updatedWorkExperience: updatedUser.workExperience,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== GET: GET WORK EXPERIENCE ======================
  /**
   * @description To Get all the work experience by user.
   * @param  {string} user_id
   * @returns  {Promise<IAddWorkExperience[]>} Returns user.workExperience array of object.
   */
  async getWorkExperience(user_id: string): Promise<IAddWorkExperience | any> {
    try {
      const userById = await this.validateUser(
        user_id,
        FOR_ARRAY.WORK_EXPERIENCE,
      );
      return {
        workExperience: userById.workExperience,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== GET: GET WORK EXPERIENCE BY ID ======================
  /**
   * @description To Get the user work experience by id.
   * @param  {string} user_id
   * @param  {string} workExp_id
   * @returns  {Promise<IAddWorkExperience[]>} Returns user.workExperience array of object.
   */
  async getWorkExperienceById(
    user_id: string,
    workExp_id: string,
  ): Promise<IAddWorkExperience | any> {
    try {
      const userById = await this.validateUser(
        user_id,
        FOR_ARRAY.WORK_EXPERIENCE,
      );
      const workExperienceById = userById.workExperience
        .map((item) => {
          if (item._id === workExp_id) {
            return item;
          }
          return null;
        })
        .filter((item) => item !== null);

      if (workExperienceById.length === 0) {
        throw new HttpException(
          'Work Experience by Id not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        workExperience: workExperienceById,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== PUT: UPDATE WORK EXPERIENCE ======================
  /**
   * @description Update an work experience object in user schema.
   * @param  {string} user_id
   * @param {AddWorkExperienceDto} workExperienceDocument - The work workExperienceDocument includes _id, careerField, jobTitle, yearsInCareerField and skillsLeveragedInCareerField array.
   * @returns {Promise<IAddWorkExperience[]>} Returns user.workExperience array of object.
   */
  async updateWorkExperience(
    user_id: string,
    workExperienceDocument: AddWorkExperienceDto,
  ): Promise<IAddWorkExperience | any> {
    try {
      const { _id } = workExperienceDocument;
      const userById = await this.validateUser(
        user_id,
        FOR_ARRAY.WORK_EXPERIENCE,
      );
      var flag = false;
      const updateWorkExperience = userById.workExperience.map((item) => {
        if (item._id === _id) {
          flag = true;
          return workExperienceDocument;
        }
        return item;
      });
      if (!flag) {
        throw new HttpException(
          'Work Experience by Id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      userById.workExperience = updateWorkExperience;
      // Save the updated user
      const updateUser = await userById.save();

      return {
        updatedWorkExperience: updateUser.workExperience,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // =================== DELETE: DELETE WORK EXPERIENCE BY ID ======================
  /**
   * @description To Delete the user work experience by id.
   * @param  {string} user_id
   * @param  {string} workExp_id
   * @returns  {Promise<IAddWorkExperience[]>} Returns user.workExperience array of object.
   */
  async deleteWorkExperience(
    user_id: string,
    workExp_id: string,
  ): Promise<IAddWorkExperience | any> {
    try {
      const userById = await this.validateUser(
        user_id,
        FOR_ARRAY.WORK_EXPERIENCE,
      );
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
        throw new HttpException(
          'Work Experience by Id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      userById.workExperience = updateWorkExperience;
      // Save the updated user
      const updateUser = await userById.save();

      return {
        msg: 'Work Experience by id is deleted successfuly',
        workExperience: updateUser.workExperience,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : UPDATE CAREER ASPIRATION

  // =================== PUT: UPDATE CAREER ASPIRATION ======================
  /**
   * @description Update an career aspiration fields in user schema.
   * @param  {string} user_id
   * @param {UpdateCareerAspirationDto} careerDocument - The work careerDocument includes industryOfInterest, jobPositionOfInterest and jobPositionLevel.
   * @returns {Promise<{ message: string }>} A Promise that resolves to a success message upon updating the career aspiration.
   */
  async updateCareerAspiration(
    user_id: string,
    careerDocument: UpdateCareerAspirationDto,
  ): Promise<{ message: string } | any> {
    try {
      const userById = await this.userModel.findById(user_id);
      if (!userById) {
        throw new HttpException('User does not Exist', HttpStatus.BAD_REQUEST);
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
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : VALIDATION CONSTRAINTS

  async validateUser(user_id: string, forArray: FOR_ARRAY) {
    try {
      const userById = await this.userModel.findById(user_id);
      if (!userById) {
        throw new HttpException('User does not Exist', HttpStatus.BAD_REQUEST);
      }
      switch (forArray) {
        case FOR_ARRAY.WORK_EXPERIENCE:
          if (userById.workExperience.length === 0) {
            throw new HttpException(
              'Work Experience array is empty',
              HttpStatus.NOT_FOUND,
            );
          }
          return userById;
        case FOR_ARRAY.EDUCATION:
          if (userById.education.length === 0) {
            throw new HttpException(
              'Education array is empty',
              HttpStatus.NOT_FOUND,
            );
          }
          return userById;
        case FOR_ARRAY.CERTIFICATES:
          if (userById.certificates.length === 0) {
            throw new HttpException(
              'Certificates array is empty',
              HttpStatus.NOT_FOUND,
            );
          }
          return userById;
        default:
          throw new HttpException(
            'Something went wrong',
            HttpStatus.BAD_REQUEST,
          );
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProfileStatus(user_id: string) {
    try {
      const userExist = await this.userModel.findById(user_id);
      const areFieldsEmpty =
        !userExist.industryOfInterest ||
        !userExist.jobPositionOfInterest ||
        !userExist.jobPositionLevel ||
        !userExist.education ||
        !userExist.certificates ||
        userExist.education.length === 0 ||
        userExist.certificates.length === 0;

      // Update the profileStatus
      const updateData = {
        profileStatus: areFieldsEmpty ? 'incomplete' : 'complete',
      };

      // After updating the profileStatus, fetch the updated user.
      const updatedUser = await this.userModel.findOneAndUpdate(
        { _id: user_id },
        updateData,
        { new: true, upsert: true },
      );
      return updatedUser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion

  //#region : USER SUPPORT API

  async askForSupport(
    user_id: string,
    body: AskForSupportDTO,
  ): Promise<{ message: string; support: ISupport }> {
    try {
      const userExist = await this.userModel.findById(user_id);
      if (!userExist) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //#endregion
}
