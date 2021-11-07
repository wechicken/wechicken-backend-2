import {
  IsInt,
  IsEmail,
  IsString,
  Length,
  IsBoolean,
  IsUrl,
} from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInput {
  @IsInt()
  // @ApiProperty({ type: Number, description: '기수' })
  nth: number;

  @IsInt()
  // @ApiProperty({ type: Number, description: '기수 유형 ID' })
  batch_type_id: number;

  @IsEmail()
  // @ApiProperty({ type: String, description: '구글 이메일' })
  gmail: string;

  @IsString()
  @Length(5)
  // @ApiProperty({
  //   type: String,
  //   description: '구글 소셜로그인 시, 구글에서 받아오는 유니크 ID',
  // })
  gmail_id: string;

  @IsBoolean()
  // @ApiProperty({ type: Boolean, description: '계장여부' })
  is_admin: boolean;

  @IsBoolean()
  // @ApiProperty({ type: Boolean, description: '기수 그룹 참여여부' })
  is_group_joined: boolean;

  @IsString()
  @Length(2)
  // @ApiProperty({ type: String, description: '이름' })
  name: string;

  @IsUrl()
  @Length(5)
  // @ApiProperty({ type: String, description: '사용중인 블로그 주소' })
  blog_address: string;
}
