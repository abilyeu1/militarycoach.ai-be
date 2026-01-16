// Nest JS Imports
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Put,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';

// Services Imports
import { UserService } from './user.service';

// Guard Imports
import { JwtAuthGuard } from 'src/Guard/jwt.guard';

// Schema Imports

// DTO Imports
import { AddEducationDto } from './DTO/addEducation.dto';
import { AddCertificateDto } from './DTO/addCertificate.dto';
import { AddWorkExperienceDto } from './DTO/addWorkExperience.dto';
import { UpdateCareerAspirationDto } from './DTO/updateCareerAspiration.dto';

// Interfaces Imports
import { ExtendedRequest } from 'src/utils/Templates/extented-request.interface';
import IUser from './interface/user.interface';
import { UpdateUserProfileDto } from './DTO/updateUserProfile.dto';
import { AskForSupportDTO } from './DTO/askForSupport.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private userService: UserService) {}

  //#region : EDIT USER PROFILE API

  // =================== PUT: Update User Profile ======================
  /**
   * @description This endpoint takes in to be user profile details and returns the updated user array.
   * @body {UpdateUserProfileDto} userProfile - The work userProfile includes Work Experience education,  certificates and career aspiration.
   * @returns {Promise<{ message: string; user: IUser }>} Returns a Promise that resolves to a array of objects.
   */
  @Put('/edit-user-profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async updateUserProfile(
    @Body() userProfile: UpdateUserProfileDto,
    @Req() req: ExtendedRequest,
  ): Promise<{ message: string; user: IUser }> {
    const { id } = req.user;
    return await this.userService.updateUserProfile(id, userProfile);
  }

  // =================== GET: Get User Profile ======================
  /**
   * @description This endpoint fetch the user profile.
   * @param req
   * @returns {Promise<{ user: IUser }>} Returns a Promise that resolves to user
   */
  @Get('/user-profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async getUserProfile(@Req() req: ExtendedRequest): Promise<{ user: IUser }> {
    const { id } = req.user;

    return await this.userService.getUserProfile(id);
  }

  // =================== GET: Check Email already used or not ======================
  /**
   * @description This endpoint takes in to be user email and returns the success message, if email is not used.
   * @param {string} email - The email param in the end point.
   * @returns {Promise<{ message: string }>} Returns a Promise that resolves to a success message.
   */
  @Get('/check-email/:email')
  @ApiParam({
    name: 'email',
    type: String,
    required: true,
  })
  async checkEmail(
    @Param('email') email: string,
  ): Promise<{ message: string; status: number }> {
    return await this.userService.checkEmail(email);
  }
  //#endregion

  //#region : EDUCATION CRUD

  // =================== PUT: Update Education ======================
  /**
   * @description This endpoint takes in to be user education details and returns the updated user education array.
   * @body {AddEducationDto} educationDocument -  The educationDocument object containing user educatuion details.
   * @returns {Promise<IAddEducation[]>} Returns a Promise that resolves to a array of objects.
   */
  @Put('/edit-education')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async updateEducation(
    @Body() educationDocument: AddEducationDto,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.updateEducation(id, educationDocument);
  }

  // =================== POST: Add Education ======================
  /**
   * @description This endpoint takes in to be user education details and returns the education array with added object.
   * @body {AddEducationDto} educationDocument - The educationDocument object containing user educatuion details.
   * @returns {Promise<IAddEducation[]>} Returns a Promise that resolves a array of objects.
   */
  @Post('/add-education')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async addEducation(
    @Body() educationDocument: AddEducationDto,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.addEducation(id, educationDocument);
  }

  // =================== GET: Get Education By Id ======================
  /**
   * @description This endpoint takes in to be education id as param and returns user education object by id.
   * @body {string} edu_id - The edu_id param in the end point.
   * @returns {Promise<IAddEducation[]>} Returns a Promise that resolves a array of object.
   */
  @Get('/education/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async getEducationById(
    @Param('id') edu_id: string,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.getEducationById(id, edu_id);
  }

  // =================== GET: Get Education ======================
  /**
   * @description This endpoint fetch the user education array.
   * @body No body required.
   * @returns {Promise<IAddEducation[]>} Returns a Promise that resolves a array of objects.
   */
  @Get('/education')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async getEducations(@Req() req: ExtendedRequest): Promise<any> {
    const { id } = req.user;
    return await this.userService.getEducations(id);
  }

  // =================== DELETE: Delete Education By Id ======================
  /**
   * @description This endpoint takes in to be education id as param and deletes that education.
   * @body {string} edu_id - The edu_id param in the end point.
   * @returns {Promise<IAddEducation[]>} Returns a Promise that resolves a array of objects.
   */
  @Delete('/delete-education/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async deleteEducation(
    @Param('id') edu_id: string,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.deleteEducation(id, edu_id);
  }

  //#endregion

  //#region : CERTIFICATES CRUD

  // =================== PUT: Update Certificate ======================
  /**
   * @description This endpoint takes in to be user certificates details and returns the updated user certificates array of objects.
   * @body {AddCertificateDto} certificateDocument - The certificateDocument object containing user certificate details.
   * @returns {Promise<IAddCertificate[]>} Returns a Promise that resolves to an array of objects.
   */
  @Put('/edit-certificate')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async updateCertificate(
    @Body() certificateDocument: AddCertificateDto,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.updateCertificate(id, certificateDocument);
  }

  // =================== POST: Add Certificate ======================
  /**
   * @description This endpoint takes in to be user certificate details and returns the certificate array with added object.
   * @body {AddCertificateDto} certificateDocument - The certificateDocument object containing user certificate details.
   * @returns {Promise<IAddCertificate[]>} Returns a Promise that resolves to an array of objects.
   */
  @Post('/add-certificate')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async addCertificate(
    @Body() certificateDocument: AddCertificateDto,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.addCertificate(id, certificateDocument);
  }

  // =================== GET: Get Certificate By Id ======================
  /**
   * @description This endpoint takes in to be certificate id as param and returns user certificate by id.
   * @body {string} certificate_id - The certificate_id param in the end point.
   * @returns {Promise<IAddCertificate[]>} Returns a Promise that resolves to an array of objects.
   */
  @Get('/certificate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async getCertificateById(
    @Param('id') certificate_id: string,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.getCertificateById(id, certificate_id);
  }

  // =================== GET: Get Certificate ======================
  /**
   * @description This endpoint fetch the user certificate array.
   * @body No body required.
   * @returns {Promise<IAddCertificate[]>} Returns a Promise that resolves to an array of objects.
   */
  @Get('/certificate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async getCertificates(@Req() req: ExtendedRequest): Promise<any> {
    const { id } = req.user;
    return await this.userService.getCertificates(id);
  }

  // =================== DELETE: Delete Certificate By Id ======================
  /**
   * @description This endpoint takes in to be certificate id as param and deletes that certificate.
   * @body {string} certificate_id - The certificate_id param in the end point.
   * @returns {Promise<IAddCertificate[]>} Returns a Promise that resolves to an array of objects.
   */
  @Delete('/delete-certificate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async deleteCertificate(
    @Param('id') certificate_id: string,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.deleteCertificate(id, certificate_id);
  }

  //#endregion

  //#region : WORK EXPERIENCE CRUD

  // =================== PUT: Update Work Experience ======================
  /**
   * @description This endpoint takes in to be user Work Experience details and returns the updated user Work Experience array of object.
   * @body {AddWorkExperienceDto} workExperienceDocument - The workExperienceDocument object containing user work Experience details.
   * @returns {Promise<IAddWorkExperience[]>} Returns a Promise that resolves to an array of objects.
   */
  @Put('/edit-workExperience')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async updateWorkExperience(
    @Body() workExperienceDocument: AddWorkExperienceDto,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.updateWorkExperience(
      id,
      workExperienceDocument,
    );
  }

  // =================== POST: Add Work Experience ======================
  /**
   * @description This endpoint takes in to be user work Experience details and returns the work Experience array with added object.
   * @body {AddWorkExperienceDto} workExperienceDocument - The workExperienceDocument object containing user work Experience details.
   * @returns {Promise<IAddWorkExperience[]>} Returns a Promise that resolves to an array of objects.
   */
  @Post('/add-workExperience')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async addWorkExperience(
    @Body() workExperienceDocument: AddWorkExperienceDto,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.addWorkExperience(id, workExperienceDocument);
  }

  // =================== GET: Get Work Experience By Id ======================
  /**
   * @description This endpoint takes in to be work Experience id as param and returns user work Experience by id.
   * @body {string} workExp_id - The workExp_id param in the end point.
   * @returns {Promise<IAddWorkExperience[]>} Returns a Promise that resolves to an array of objects.
   */
  @Get('/workExperience/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async getWorkExperienceById(
    @Param('id') workExp_id: string,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.getWorkExperienceById(id, workExp_id);
  }

  // =================== GET: Get Work Experience ======================
  /**
   * @description This endpoint fetch the user work experience array.
   * @body No body required.
   * @returns {Promise<IAddWorkExperience[]>} Returns a Promise that resolves to an array of objects.
   */
  @Get('/workExperience')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async getWorkExperience(@Req() req: ExtendedRequest): Promise<any> {
    const { id } = req.user;
    return await this.userService.getWorkExperience(id);
  }

  // =================== DELETE: Delete Work Experience By Id ======================
  /**
   * @description This endpoint takes in to be workExp_id as param and deletes that work experience.
   * @body {string} workExp_id - The workExp_id param in the end point.
   * @returns {Promise<IAddWorkExperience[]>} Returns a Promise that resolves to an array of objects.
   */
  @Delete('/delete-workExperience/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async deleteWorkExperience(
    @Param('id') workExp_id: string,
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    const { id } = req.user;
    return await this.userService.deleteWorkExperience(id, workExp_id);
  }

  //#endregion

  //#region : UPDATE CAREER ASPIRATION

  // =================== PUT: Update Career Aspiration ======================
  /**
   * @description This endpoint takes in to be user Career Aspiration details and returns the success message.
   * @body {UpdateCareerAspirationDto} careerDocument - The work careerDocument includes industryOfInterest, jobPositionOfInterest and jobPositionLevel..
   * @returns {Promise<{ message: string }>} A Promise that resolves to a success message upon updating the career aspiration.
   */
  @Put('/edit-careerAspiration')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async updateCareerAspiration(
    @Body() careerDocument: UpdateCareerAspirationDto,
    @Req() req: ExtendedRequest,
  ): Promise<{ message: string }> {
    const { id } = req.user;
    return await this.userService.updateCareerAspiration(id, careerDocument);
  }

  //#endregion

  //#region : USER SUPPORT API

  @Post('/support')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async userSupport(
    @Body() body: AskForSupportDTO,
    @Req() req: ExtendedRequest,
  ) {
    const { id } = req.user;
    return await this.userService.askForSupport(id, body);
  }

  //#endregion
}
