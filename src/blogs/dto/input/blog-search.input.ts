import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class BlogSearchInput {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  offset: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Max(50)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  batchNth: number;

  @IsOptional()
  @IsString()
  blogTitle: string;

  @IsOptional()
  @IsString()
  userName: string;
}
