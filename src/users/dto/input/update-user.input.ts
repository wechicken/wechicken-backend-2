import { IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateUserInput {
  @IsOptional()
  thumbnail?: string;

  @IsUrl()
  @Length(5)
  @IsOptional()
  blog_address?: string;
}
