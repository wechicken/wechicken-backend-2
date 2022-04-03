import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

@Injectable()
export class UploadService {
  s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.EXTERNAL_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.EXTERNAL_AWS_SECRET_ACCESS_KEY,
    });
    this.s3 = new AWS.S3();
  }

  generateProfileFilePath(email: string, fileName: string) {
    const mailId = email.split('@').shift();

    return `${mailId}/profile.${fileName.split('.').pop()}`;
  }

  async fileUpload(email: string, file: Express.Multer.File) {
    const { originalname } = file;

    // try {
    //   await this.s3
    //     .upload({
    //       Bucket: process.env.EXTERNAL_AWS_S3_BUCKET_NAME,
    //       ACL: 'public-read',
    //       Key: this.generateProfileFilePath(email, originalname),
    //       Body: file.buffer,
    //       ContentType: 'mimetype',
    //       ContentDisposition: 'inline',
    //     })
    //     .promise();
    // } catch (err) {
    //   console.log(err);
    //   throw new Error('파일 업로드에 실패했습니다.');
    // }

    return `https://jwtbucket.s3.ap-northeast-2.amazonaws.com/${this.generateProfileFilePath(
      email,
      originalname,
    )}`;
  }
}

export function fileInterceptor() {
  return FileInterceptor('file', {
    storage: multerS3({
      s3: new AWS.S3(),
      bucket: process.env.EXTERNAL_AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: (req, file, cb) => {
        cb(null, generateProfileFilePath(req.user.gmail, file.originalname));
      },
    }),
  });
}

function generateProfileFilePath(email: string, fileName: string) {
  const mailId = email.split('@').shift();

  return `${mailId}/profile.${fileName.split('.').pop()}`;
}
