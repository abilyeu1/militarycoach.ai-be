// Nest JS Imports
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Services Imports
import { S3Service } from './s3.service';

// Controllers Imports
import { S3Controller } from './s3.controller';


@Module({
  imports: [],
  controllers: [S3Controller],
  providers: [S3Service, ConfigService],
  exports: [S3Service],
})
export class S3Module { }
