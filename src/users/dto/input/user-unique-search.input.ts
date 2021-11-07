import { IsEmail } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class UserUniqueSearchInput {
  @IsEmail()
  // @ApiProperty({ type: String, description: '테스트용 이메일' })
  gmail: string;
}
