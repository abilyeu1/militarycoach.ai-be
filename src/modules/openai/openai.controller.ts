// NestJS imports
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// Swagger imports
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

// Service imports
import { OpenaiService } from './openai.service';

// Guard imports
import { JwtAuthGuard } from 'src/Guard/jwt.guard';

// DTO & type imports
import { UserDocument } from 'src/schemas/users/user.schema';
import { FileUploadDto } from '../s3/DTO/fileHandler.dto';
import { CareerWizardDTO } from './DTO/careerWizard.dto';
import { CoverLetterWizardDTO } from './DTO/coverLetterWizard.dto';
import { MockInterviewDTO } from './DTO/mockInterview.dto';
import { SkillsGapAnalysisDTO } from './DTO/skillsGapAnalysis.dto';
import { SalaryNegotiatorDTO } from './DTO/salaryNegotiator.dto';
import { SkillbridgeWizardDTO } from './DTO/skillbridgeWizard.dto';
import { ParseCvDto } from './DTO/parseCV.dto';

@Controller('openai')
@ApiTags('Open AI')
export class OpenaiController {
  constructor(private openaiService: OpenaiService) {}

  // =================== POST: Bullet Translator - Single Chat ======================
  /**
   * @description This endpoint takes in a bullet point and returns a military translated word.
   * @body {string} bullet - The bullet point to be translated.
   * @returns {Promise<string>} Returns a Promise that resolves to a string.
   */
  @Post('/bullet-translator')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        bullet: {
          type: 'string',
          example: 'Bullet point text here',
        },
      },
    },
  })
  async bulletTranslator(
    @Body() { bullet }: { bullet: string },
    @Request() req: { user: UserDocument },
  ): Promise<{ message: string }> {
    const { user } = req;
    return await this.openaiService.bulletTranslator(user.id, bullet);
  }

  // =================== POST: Career Wizard - Conversation ======================
  /**
   * @description This endpoint takes in a user profile and returns a career wizard.
   * @body {Career Wizard}
   * @returns {Promise<string>} Returns career wizard response as a string.
   */
  @Post('/career-wizard/:chatID')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'chatID',
    type: String,
    required: true,
  })
  async careerWizardTool(
    @Param() { chatID }: { chatID: string },
    @Body() career: CareerWizardDTO,
    @Request() req: { user: UserDocument },
  ): Promise<{ content: string }> {
    const { user } = req;
    return await this.openaiService.careerWizard(chatID, user.id, career);
  }

  // =================== POST: Cover Letter Wizard - Single Chat ======================
  /**
   * @description This endpoint takes in a user profile and returns a cover letter wizard.
   * @body {Cover Letter Wizard}
   * @returns {Promise<string>} Returns cover letter wizard response as a string.
   */
  @Post('/cover-letter-wizard')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async coverLetterWizardTool(
    @Body() career: CoverLetterWizardDTO,
    @Request() req: { user: UserDocument },
  ): Promise<{ content: string }> {
    const { user } = req;
    return await this.openaiService.coverLetterWizard(user.id, career);
  }

  // =================== POST: Mock Interview - Conversation ======================
  /**
   * @description This endpoint takes in a user profile and returns a mock interview.
   * @body {Mock Interview}
   * @returns {Promise<string>} Returns mock interview response as a string.
   */
  @Post('/mock-interview/:chatID')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'chatID',
    type: String,
    required: true,
  })
  async mockInterview(
    @Param() { chatID }: { chatID: string },
    @Body() career: MockInterviewDTO,
    @Request() req: { user: UserDocument },
  ): Promise<{ content: string; basePrompt: string }> {
    const { user } = req;
    return await this.openaiService.mockInterview(chatID, user.id, career);
  }

  // =================== POST: Skills Gap Analysis - Conversation ======================
  /**
   * @description This endpoint takes in a user profile and returns a skills gap analysis.
   * @body {Skills Gap Analysis}
   * @returns {Promise<string>} Returns skills gap analysis response as a string.
   */
  @Post('/skills-gap-analysis/:chatID')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'chatID',
    type: String,
    required: true,
  })
  async skillsGapAnalysis(
    @Param() { chatID }: { chatID: string },
    @Body() career: SkillsGapAnalysisDTO,
    @Request() req: { user: UserDocument },
  ): Promise<{ content: string; basePrompt: string }> {
    const { user } = req;
    return await this.openaiService.skillsGapAnalysis(chatID, user.id, career);
  }

  // =================== POST: Salary Negotiator - Conversation ======================
  /**
   * @description This endpoint takes in a user profile and salary details and returns salary negotiation advice.
   * @body {Salary Negotiator}
   * @returns {Promise<string>} Returns salary negotiation response as a string.
   */
  @Post('/salary-negotiator/:chatID')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'chatID',
    type: String,
    required: true,
  })
  async salaryNegotiator(
    @Param() { chatID }: { chatID: string },
    @Body() salaryData: SalaryNegotiatorDTO,
    @Request() req: { user: UserDocument },
  ): Promise<{ content: string; basePrompt: string }> {
    const { user } = req;
    return await this.openaiService.salaryNegotiator(chatID, user.id, salaryData);
  }

  // =================== POST: SkillBridge Wizard - Conversation ======================
  /**
   * @description This endpoint searches for SkillBridge opportunities and provides recommendations.
   * @body {SkillBridge Wizard}
   * @returns {Promise<string>} Returns SkillBridge recommendations as a string.
   */
  @Post('/skillbridge-wizard/:chatID')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  @ApiParam({
    name: 'chatID',
    type: String,
    required: true,
  })
  async skillbridgeWizard(
    @Param() { chatID }: { chatID: string },
    @Body() skillbridgeData: SkillbridgeWizardDTO,
    @Request() req: { user: UserDocument },
  ): Promise<{ content: string; basePrompt: string }> {
    const { user } = req;
    return await this.openaiService.skillbridgeWizard(chatID, user.id, skillbridgeData);
  }

  // =================== POST: Parse CV - File Upload ======================
  /**
   * @description This endpoint takes in a user profile and returns normalized CV data using OPEN AI Assistant tool knowledge retrieval.
   * @param file
   * @returns Normalized CV JSON.
   */
  @Post('/parse-cv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload your CV/Resume here',
    type: ParseCvDto,
  })
  async upload(@UploadedFile() file: any) {
    try {
      console.log('Uploaded file:', file);
      return await this.openaiService.parseCV(file);
    } catch (error) {
      console.log('Error in parseCV controller:', error);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  // =================== POST: Recommend Industry ======================
  /**
   * @description This endpoint takes in a user profile and returns a recommended industry.
   * @body {Skills Gap Analysis}
   * @returns {Promise<string>} Returns recommended industry response as a string.
   */
  @Get('/recommend-industry')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth('jwt')
  async recommendIndustry(
    @Request() req: { user: UserDocument },
  ): Promise<{ recommendations: string }> {
    const { user } = req;
    return await this.openaiService.recommendIndustry(user.id);
  }
}
