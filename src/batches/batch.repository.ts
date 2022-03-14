import { EntityRepository, Repository } from 'typeorm';
import { Batch } from './batch.entity';

@EntityRepository(Batch)
export class BatchRepository extends Repository<Batch> {
  createAndSaveBatch(batch_type_id: number, nth: number): Promise<Batch> {
    const batch = this.create({ batch_type_id, nth });

    return this.save(batch);
  }

  getTopThreeUsersByBlogCount(batch_id: number): Promise<Batch[]> {
    const FIRST_TO_THIRD = 3;

    return this.createQueryBuilder('batch')
      .select(['user.id', 'user.name', 'user.thumbnail'])
      .addSelect('COUNT(blog.id)', 'blogs_count')
      .innerJoin('batch.users', 'user', 'user.batch_id = :batch_id', {
        batch_id,
      })
      .innerJoin('user.blogs', 'blog')
      .groupBy('user.id')
      .orderBy('blogs_count', 'DESC')
      .limit(FIRST_TO_THIRD)
      .getRawMany();
  }

  getBlogCountsByUserId(
    batch_id: number,
    from: string,
    to: string,
  ): Promise<Batch[]> {
    return this.createQueryBuilder('batch')
      .select(['user.id'])
      .addSelect('COUNT(blog.id)', 'blogs_count')
      .innerJoin('batch.users', 'user', 'user.batch_id = :batch_id', {
        batch_id,
      })
      .innerJoin('user.blogs', 'blog')
      .where('blog.written_datetime BETWEEN :from AND :to', { from, to })
      .andWhere('blog.deleted_at IS NULL')
      .groupBy('user.id')
      .getRawMany();
  }

  getUsersOfBatch(batch_id: number): Promise<Batch[]> {
    return this.createQueryBuilder('batch')
      .select([
        'batch.penalty',
        'batch.count_per_week',
        'user.id',
        'user.thumbnail',
        'user.name',
      ])
      .innerJoin('batch.users', 'user', 'user.batch_id = :batch_id', {
        batch_id,
      })
      .getRawMany();
  }

  getBlogsOfWeek(batch_id: number, from: string, to: string): Promise<Batch[]> {
    return this.createQueryBuilder('batch')
      .select([
        'batch.id',
        'user.id',
        'user.name',
        'blog.title',
        'blog.link',
        'blog.written_datetime AS blog_written_date',
        'blog_type.name',
      ])
      .innerJoin('batch.users', 'user', 'user.batch_id = :batch_id', {
        batch_id,
      })
      .innerJoin('user.blogs', 'blog')
      .leftJoin('user.blogType', 'blog_type')
      .where('blog.written_datetime BETWEEN :from AND :to', { from, to })
      .andWhere('blog.deleted_at IS NULL')
      .getRawMany();
  }
}
