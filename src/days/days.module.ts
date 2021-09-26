import { Module } from '@nestjs/common';
import { DaysService } from './days.service';

@Module({
  providers: [DaysService],
  exports: [DaysService],
})
export class DaysModule {}
