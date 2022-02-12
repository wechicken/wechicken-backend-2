import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PagingInput {
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
}

export class BlogSearchInput extends PagingInput {
  @IsOptional()
  @IsString()
  blogTitle?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  batchNth?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
