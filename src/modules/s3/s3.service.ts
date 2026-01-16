// Nest JS Imports
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

// NPM Package Imports
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
  constructor(public configService: ConfigService) {}

  AWS_S3_BUCKET = 'milcoach';
  s3 = new S3({
    accessKeyId: this.configService.get('app.S3_ACCESS_KEY'),
    secretAccessKey: this.configService.get('app.S3_SECRET_KEY'),
  });

  // =================== Upload File into S3 ======================
  /**
   * Upload File into S3.
   * @param {string} file
   * @returns Upload File into S3.
   */
  async uploadFileIntoTempFolderS3(file: any, uid: string) {
    console.log(
      '🚀 ~ file: s3.service.ts:25 ~ S3Service ~ uploadFileIntoTempFolderS3 ~ file:',
      file.originalname.trim().replaceAll(' ', '_'),
    );

    // If file type is not pdf then throw error
    if (file.mimetype !== 'application/pdf') {
      throw new HttpException(
        'Only PDF files are allowed!',
        HttpStatus.BAD_REQUEST,
      );
    }

    // remove  .pdf from file name

    const fileName = file.originalname
      .trim()
      .replaceAll(' ', '_')
      .split('.pdf')[0];

    const fileType = file.mimetype.split('/');

    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: `${fileName}-${uid}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    try {
      let s3Response = await this.s3.upload(params).promise();
      return {
        message: 'File uploaded successfully!',
        imagePath: s3Response.Location,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Move File from Temp Folder into S3.
   * @param {string} fileUrl
   * @param {string} newFolderPath
   * @returns Move File from Temp Folder into S3.
   */
  async moveFileFromFolderIntoS3(fileUrl: string, newFolderPath: string) {
    const fileName = fileUrl.split('/').pop();
    let params = {
      Bucket: this.AWS_S3_BUCKET,
      CopySource: `${this.AWS_S3_BUCKET}/temp/${fileName}`,
      Key: `${newFolderPath}`,
    };
    try {
      let s3Response = await this.s3.copyObject(params).promise();
      return s3Response;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
