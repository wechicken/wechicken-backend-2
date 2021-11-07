import { IsNotEmpty, IsDateString } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';

export class BatchSearchInput {
  @IsNotEmpty()
  @IsDateString()
  // @ApiProperty({ description: '조회할 날짜 (YYYY-MM-DD)' })
  selected_date: string;
}
