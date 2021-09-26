import { IsNotEmpty, IsDateString } from 'class-validator';

export class BatchSearchInput {
  @IsNotEmpty()
  @IsDateString()
  selected_date: string;
}
