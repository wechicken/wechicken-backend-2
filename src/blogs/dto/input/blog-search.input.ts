import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BlogSearchInput {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ description: 'offset' })
  offset: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Max(50)
  @ApiProperty({ description: 'limit' })
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ description: '기수', required: false })
  batchNth?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '게시글 제목', required: false })
  blogTitle?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '유저 이름', required: false })
  userName?: string;
}
