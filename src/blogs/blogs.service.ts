import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Blog, BlogResponse } from './blog.entity';
import { BlogRepository } from './blog.repository';
import { BlogSearchInput } from './dto/input/blog-search.input';
import { CreateBlogInput } from './dto/input/create-blog.input';
import { UpdateBlogInput } from './dto/input/update-blog.input';
import { go, object, entries, each, map, keys, join } from 'fxjs';

@Injectable()
export class BlogsService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async findBlogs(
    blogSearchInput: BlogSearchInput,
    user_id: number,
  ): Promise<BlogResponse[]> {
    const { offset, limit, ...options } = blogSearchInput;
    const [query, queryParams] = this.buildFindBlogsWhere(options);
    const blogs = await this.blogRepository.findBlogs(
      {
        query,
        queryParams,
        offset,
        limit,
      },
      user_id,
    );

    return blogs.map(({ likes, bookmarks, ...blog }) => ({
      ...blog,
      is_liked: !!likes.length && likes[0].status,
      is_bookmarked: !!bookmarks.length && bookmarks[0].status,
    }));
  }

  async findBlogById(blog_id: number): Promise<Blog> {
    return this.blogRepository.findBlogById(blog_id);
  }

  async createBlog(user_id: number, createBlogInput: CreateBlogInput) {
    return this.blogRepository.createBlog(user_id, createBlogInput);
  }

  async updateBlog(blog_id: number, updateBlogInput: UpdateBlogInput) {
    return this.blogRepository.updateBlog(blog_id, updateBlogInput);
  }

  private buildFindBlogsWhere<T>(
    options: T,
  ): [string, Record<string, number | string>] {
    const queryMapper = {
      userName: 'user.name LIKE :userName',
      blogTitle: 'blog.title LIKE :blogTitle',
      batchNth: 'batch.nth = :batchNth',
      deletedAt: 'blog.deleted_at is null',
    };

    const valueTransformMapper = {
      userName: (v: string) => `${v}%`,
      blogTitle: (v: string) => `%${v}%`,
      batchNth: (v: string) => Number(v),
    };

    const throwErrorIfBadRequest = (v) => {
      if (!v)
        throw new HttpException(
          '지원하지 않는 검색조건',
          HttpStatus.BAD_REQUEST,
        );
      return v;
    };

    const query = go(
      { ...options, ...{ deletedAt: null } },
      keys,
      map((key) => queryMapper[key]),
      each(throwErrorIfBadRequest),
      join(' AND '),
    );

    const queryParams = go(
      options,
      entries,
      map(([k, v]) => [k, valueTransformMapper[k](v)]),
      object,
    );

    return [query, queryParams];
  }
}
