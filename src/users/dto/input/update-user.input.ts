import { IsOptional, IsUrl, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInput {
  @IsOptional()
  @ApiProperty({ description: '프로필 사진으로 저장할 파일' })
  thumbnail?: string;

  @IsUrl()
  @Length(5)
  @IsOptional()
  @ApiProperty({ type: String, description: '사용중인 블로그 주소' })
  blog_address?: string;
}
