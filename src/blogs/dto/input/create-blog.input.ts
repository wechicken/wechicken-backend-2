import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsUrl,
} from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogInput {
  @IsNotEmpty()
  @IsString()
  // @ApiProperty({ description: '제목' })
  title: string;

  @IsOptional()
  @IsString()
  // @ApiProperty({ description: '부제목' })
  subtitle: string;

  @IsNotEmpty()
  @IsUrl()
  // @ApiProperty({ description: '주소' })
  link: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  // @ApiProperty({ description: '게시글 썸네일' })
  thumbnail: string;

  @IsNotEmpty()
  @IsDateString()
  // @ApiProperty({ description: '게시글 작성일' })
  written_date: Date;
}
