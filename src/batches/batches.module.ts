import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchType } from './batch-type.entity';
import { BatchRepository } from './batch.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BatchRepository, BatchType])],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [TypeOrmModule, BatchesService],
})
export class BatchesModule {}
