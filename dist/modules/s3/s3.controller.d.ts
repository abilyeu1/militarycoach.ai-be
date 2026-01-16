import { S3Service } from './s3.service';
export declare class S3Controller {
    private readonly S3Service;
    constructor(S3Service: S3Service);
    upload(file: any, uid: string): Promise<{
        message: string;
        imagePath: string;
    }>;
}
