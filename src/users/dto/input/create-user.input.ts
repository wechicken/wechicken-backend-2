import {
  IsInt,
  IsEmail,
  IsString,
  Length,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateUserInput {
  @IsInt()
  nth: number;

  @IsInt()
  batch_type_id: number;

  @IsEmail()
  gmail: string;

  @IsString()
  @Length(5)
  gmail_id: string;

  @IsBoolean()
  is_admin: boolean;

  @IsBoolean()
  is_group_joined: boolean;

  @IsString()
  @Length(2)
  name: string;

  @IsUrl()
  @Length(5)
  blog_address: string;
}
