import {
  EntityRepository,
  InsertResult,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Blog } from './blog.entity';
import { CreateBlogInput } from './dto/input/create-blog.input';
import { UpdateBlogInput } from './dto/input/update-blog.input';

@EntityRepository(Blog)
export class BlogRepository extends Repository<Blog> {
  findBlogs(
    {
      query,
      queryParams,
      offset = 0,
      limit = 30,
    }: {
      query: string;
      queryParams: Record<string, number | string>;
      offset: number;
      limit: number;
    },
    user_id: number,
  ): Promise<Blog[]> {
    return this.createQueryBuilder('blog')
      .select([
        'blog',
        'user.id',
        'user.name',
        'batch.nth',
        'batchType.name',
        'bookmark.status',
        'like.status',
      ])
      .innerJoin('blog.user', 'user')
      .innerJoin('user.batch', 'batch')
      .innerJoin('batch.batchType', 'batchType')
      .leftJoin('blog.bookmarks', 'bookmark', 'bookmark.user_id = :user_id', {
        user_id,
      })
      .leftJoin('blog.likes', 'like', 'like.user_id = :user_id', { user_id })
      .where(query, queryParams)
      .skip(offset)
      .take(limit)
      .orderBy('blog.written_date', 'DESC')
      .getMany();
  }

  findBlogById(blog_id: number): Promise<Blog> {
    return this.createQueryBuilder('blog')
      .where('blog.id = :blog_id', { blog_id })
      .getOne();
  }

  createBlog(
    user_id: number,
    { title, subtitle, link, thumbnail, written_date }: CreateBlogInput,
  ): Promise<InsertResult> {
    return this.createQueryBuilder()
      .insert()
      .into(Blog)
      .values({
        user_id,
        title,
        subtitle,
        link,
        thumbnail,
        written_date,
      })
      .execute();
  }

  updateBlog(
    blog_id: number,
    { title, subtitle, link, thumbnail, written_date }: UpdateBlogInput,
  ): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(Blog)
      .set({ title, subtitle, link, thumbnail, written_date })
      .where('id = :blog_id', { blog_id })
      .execute();
  }
}
