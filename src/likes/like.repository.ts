import { EntityRepository, Repository } from 'typeorm';
import { Like } from './like.entity';

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {
  findLikeByUniqueKey(user_id: number, blog_id: number) {
    return this.createQueryBuilder('bookmark')
      .where('blog_id = :blog_id', { blog_id })
      .andWhere('user_id = :user_id', { user_id })
      .getOne();
  }

  createLike(user_id: number, blog_id: number) {
    return this.createQueryBuilder()
      .insert()
      .into(Like)
      .values({ user_id, blog_id, status: true })
      .execute();
  }

  updateStatus({ user_id, blog_id, status }: Like) {
    return this.createQueryBuilder()
      .update(Like)
      .set({ status: !status })
      .where('blog_id = :blog_id', { blog_id })
      .andWhere('user_id = :user_id', { user_id })
      .execute();
  }
}
