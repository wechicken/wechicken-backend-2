import { IsEmail } from 'class-validator';

export class UserUniqueSearchInput {
  @IsEmail()
  gmail: string;
}
