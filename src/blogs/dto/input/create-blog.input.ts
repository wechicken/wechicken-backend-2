import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreateBlogInput {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
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
  written_date: Date;
}
