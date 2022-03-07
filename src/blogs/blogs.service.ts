import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Blog, BlogResponse } from './blog.entity';
import { BlogRepository } from './blog.repository';
import { BlogSearchInput } from './dto/input/blog-search.input';
import { CreateBlogInput } from './dto/input/create-blog.input';
import { UpdateBlogInput } from './dto/input/update-blog.input';
import * as F from 'fxjs/Strict';

export const FIND_BLOGS_BY_USER_INPUT = {
  LIKE: 'like',
  BOOKMARK: 'bookmark',
} as const;

type FIND_BLOGS_BY_USER_INPUT =
  typeof FIND_BLOGS_BY_USER_INPUT[keyof typeof FIND_BLOGS_BY_USER_INPUT];

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

    return this.buildBlogResponse(blogs);
  }

  async findBlogsByUser(user_id: number, by: FIND_BLOGS_BY_USER_INPUT) {
    const queryMapper = {
      like: 'like.user_id = :user_id AND like.status = true',
      bookmark: 'bookmark.user_id = :user_id AND bookmark.status = true',
    };

    const blogs = await this.blogRepository.findBlogsByUser(
      queryMapper[by],
      user_id,
    );

    return this.buildBlogResponse(blogs);
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

  async deleteBlog(blog_id: number) {
    return this.blogRepository.deleteBlog(blog_id);
  }

  private buildFindBlogsWhere<T>(
    options: T,
  ): [string, Record<string, number | string>] {
    const queryMapper = {
      userName: 'user.name LIKE :userName',
      blogTitle: 'blog.title LIKE :blogTitle',
      batchNth: 'batch.nth = :batchNth',
      userId: 'user.id = :userId',
    };

    const valueTransformMapper = {
      userName: (v: string) => `${v}%`,
      blogTitle: (v: string) => `%${v}%`,
      batchNth: (v: string) => Number(v),
      userId: (v: number) => Number(v),
    };

    const throwErrorIfBadRequest = (v) => {
      if (!v)
        throw new HttpException(
          '지원하지 않는 검색조건',
          HttpStatus.BAD_REQUEST,
        );
      return v;
    };

    const query = F.goS(
      options,
      F.keys,
      F.stopIf((a) => !a.length, ''),
      F.map((key) => queryMapper[key]),
      F.each(throwErrorIfBadRequest),
      F.join(' AND '),
    );

    const queryParams = F.go(
      options,
      F.entries,
      F.map(([k, v]) => [k, valueTransformMapper[k](v)]),
      F.object,
    );

    return [query, queryParams];
  }

  private buildBlogResponse(blogs: Blog[]): BlogResponse[] {
    return blogs.map(({ likes, bookmarks, ...blog }) => ({
      ...blog,
      is_liked: !!likes.length && likes[0].status,
      is_bookmarked: !!bookmarks.length && bookmarks[0].status,
    }));
  }
}
