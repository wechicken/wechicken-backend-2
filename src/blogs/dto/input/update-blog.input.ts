import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class UpdateBlogInput {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsNotEmpty()
  @IsUrl()
  thumbnail: string;

  @IsNotEmpty()
  @IsDateString()
  written_date: string;
}
