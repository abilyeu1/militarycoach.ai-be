// NestJS Imports
import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';

// Service imports
import { S3Service } from './s3.service';
import { FileUploadDto } from './DTO/fileHandler.dto';

@Controller('S3')
@ApiTags('S3 Image Bucket')
export class S3Controller {
  constructor(private readonly S3Service: S3Service) {}

  // =================== POST: Upload Image ======================
  /**
   * This API is used to upload image to S3 bucket
   * @BODY body: { User Profile Image }
   * @returns ImageUrl
   */
  @Post('fileUpload/:uid')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'uid',
    type: 'string',
  })
  @ApiBody({
    description: 'Upload your file here',
    type: FileUploadDto,
  })
  async upload(@UploadedFile() file, @Param('uid') uid: string) {
    try {
      const result = await this.S3Service.uploadFileIntoTempFolderS3(file, uid);
      return result;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
