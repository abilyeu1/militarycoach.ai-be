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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.AWS_S3_BUCKET = 'milcoach';
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: this.configService.get('app.S3_ACCESS_KEY'),
            secretAccessKey: this.configService.get('app.S3_SECRET_KEY'),
        });
    }
    async uploadFileIntoTempFolderS3(file, uid) {
        console.log('🚀 ~ file: s3.service.ts:25 ~ S3Service ~ uploadFileIntoTempFolderS3 ~ file:', file.originalname.trim().replaceAll(' ', '_'));
        if (file.mimetype !== 'application/pdf') {
            throw new common_1.HttpException('Only PDF files are allowed!', common_1.HttpStatus.BAD_REQUEST);
        }
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
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async moveFileFromFolderIntoS3(fileUrl, newFolderPath) {
        const fileName = fileUrl.split('/').pop();
        let params = {
            Bucket: this.AWS_S3_BUCKET,
            CopySource: `${this.AWS_S3_BUCKET}/temp/${fileName}`,
            Key: `${newFolderPath}`,
        };
        try {
            let s3Response = await this.s3.copyObject(params).promise();
            return s3Response;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
exports.S3Service = S3Service;
//# sourceMappingURL=s3.service.js.map