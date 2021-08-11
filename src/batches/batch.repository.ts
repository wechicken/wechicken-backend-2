import { EntityRepository, Repository } from 'typeorm';
import { Batch } from './batch.entity';

@EntityRepository(Batch)
export class BatchRepository extends Repository<Batch> {
  createAndSaveBatch(batch_type_id: number, nth: number): Promise<Batch> {
    const batch = this.create({ batch_type_id, nth });

    return this.save(batch);
  }
}
