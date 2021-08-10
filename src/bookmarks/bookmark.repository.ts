import { EntityRepository, Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';

@EntityRepository(Bookmark)
export class BookmarkRepository extends Repository<Bookmark> {
  findBookmarkByUniqueKey(user_id: number, blog_id: number) {
    return this.createQueryBuilder('bookmark')
      .where('blog_id = :blog_id', { blog_id })
      .andWhere('user_id = :user_id', { user_id })
      .getOne();
  }

  createBookmark(user_id: number, blog_id: number) {
    return this.createQueryBuilder()
      .insert()
      .into(Bookmark)
      .values({ user_id, blog_id, status: true })
      .execute();
  }

  updateStatus({ user_id, blog_id, status }: Bookmark) {
    return this.createQueryBuilder()
      .update(Bookmark)
      .set({ status: !status })
      .where('blog_id = :blog_id', { blog_id })
      .andWhere('user_id = :user_id', { user_id })
      .execute();
  }
}
