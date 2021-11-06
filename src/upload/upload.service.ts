import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class UploadService {
  constructor() {}

  init() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  generateProfileFilePath(email: string, fileName: string) {
    const mailId = email.split('@').shift();

    return `${mailId}/profile.${fileName.split('.').pop()}`;
  }

  async fileUpload(email: string, file: Express.Multer.File) {
    this.init();

    const { originalname } = file;

    const s3 = new AWS.S3();
    try {
      await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          ACL: 'public-read',
          Key: this.generateProfileFilePath(email, originalname),
          Body: file.buffer,
          ContentType: 'mimetype',
          ContentDisposition: 'inline',
        })
        .promise();
    } catch (err) {
      console.log(err);
      throw new Error('파일 업로드에 실패했습니다.');
    }

    return `https://jwtbucket.s3.ap-northeast-2.amazonaws.com/${this.generateProfileFilePath(
      email,
      originalname,
    )}`;
  }
}
