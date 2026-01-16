import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
export declare class S3Service {
    configService: ConfigService;
    constructor(configService: ConfigService);
    AWS_S3_BUCKET: string;
    s3: S3;
    uploadFileIntoTempFolderS3(file: any, uid: string): Promise<{
        message: string;
        imagePath: string;
    }>;
    moveFileFromFolderIntoS3(fileUrl: string, newFolderPath: string): Promise<import("aws-sdk/lib/request").PromiseResult<S3.CopyObjectOutput, import("aws-sdk").AWSError>>;
}
