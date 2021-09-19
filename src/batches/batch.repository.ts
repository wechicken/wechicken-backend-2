import { EntityRepository, Repository } from 'typeorm';
import { Batch } from './batch.entity';

@EntityRepository(Batch)
export class BatchRepository extends Repository<Batch> {
  createAndSaveBatch(batch_type_id: number, nth: number): Promise<Batch> {
    const batch = this.create({ batch_type_id, nth });

    return this.save(batch);
  }

  getUsersBlogCount(batch_id: number): Promise<Batch[]> {
    const FIRST_TO_THIRD = 3;

    return this.createQueryBuilder('batch')
      .select(['batch.nth', 'batch.title', 'user.gmail_id', 'user.name'])
      .addSelect('COUNT(blog.id)', 'blogsCount')
      .innerJoin('batch.users', 'user', 'user.batch_id = :batch_id', {
        batch_id,
      })
      .leftJoin('user.blogs', 'blog')
      .groupBy('user.id')
      .orderBy('blogsCount', 'DESC')
      .limit(FIRST_TO_THIRD)
      .getRawMany();
  }
}
