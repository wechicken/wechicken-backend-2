import { Injectable } from '@nestjs/common';
import { Batch } from './batch.entity';
import { BatchRepository } from './batch.repository';

@Injectable()
export class BatchesService {
  constructor(private batchRepository: BatchRepository) {}

  async findOrCreateBatch(batch_type_id: number, nth: number): Promise<Batch> {
    const foundBatch = await this.batchRepository.findOne({
      batch_type_id,
      nth,
    });

    if (foundBatch) return foundBatch;

    return this.batchRepository.createAndSaveBatch(batch_type_id, nth);
  }
}
