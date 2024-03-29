import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ValidUser } from 'src/auth/decorator/ValidUser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BookmarksService } from 'src/bookmarks/bookmarks.service';
import { CamelCaseInterceptor } from 'src/interceptors/CamelCaseInterceptor';
import { LikesService } from 'src/likes/likes.service';
import { User } from 'src/users/user.entity';
import { BlogsService, FIND_BLOGS_BY_USER_INPUT } from './blogs.service';
import { BlogSearchInput, PagingInput } from './dto/input/blog-search.input';
import { CreateBlogInput } from './dto/input/create-blog.input';
import { UpdateBlogInput } from './dto/input/update-blog.input';

@UseInterceptors(CamelCaseInterceptor)
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly bookmarksService: BookmarksService,
    private readonly likesService: LikesService,
  ) {}

  @Get()
  async getBlogs(@Query() blogSearchInput: BlogSearchInput) {
    return this.blogsService.findBlogs(blogSearchInput, null);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth')
  async getBlogsAuth(
    @ValidUser() { id: user_id }: User,
    @Query() blogSearchInput: BlogSearchInput,
  ) {
    return this.blogsService.findBlogs(blogSearchInput, user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getUserBlogs(
    @ValidUser() { id: user_id }: User,
    @Query() pagingInput: PagingInput,
  ) {
    return this.blogsService.findBlogs(
      { ...pagingInput, userId: user_id },
      user_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBlog(
    @ValidUser() { id: user_id }: User,
    @Body() createBlogInput: CreateBlogInput,
  ) {
    const { raw } = await this.blogsService.createBlog(
      user_id,
      createBlogInput,
    );

    if (!raw) {
      throw new HttpException(
        'CREATE BLOG FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'SUCCESS' };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':blog_id')
  async updateBlog(
    @ValidUser() { id: user_id }: User,
    @Param('blog_id', ParseIntPipe) blog_id: number,
    @Body() updateBlogInput: UpdateBlogInput,
  ) {
    const foundBlog = await this.blogsService.findBlogById(blog_id);
    if (!foundBlog) {
      throw new HttpException('BLOG NOT FOUND', HttpStatus.NOT_FOUND);
    }

    if (foundBlog.user_id !== user_id) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    const { raw } = await this.blogsService.updateBlog(
      blog_id,
      updateBlogInput,
    );

    if (!raw) {
      throw new HttpException(
        'UPDATE BLOG FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'SUCCESS' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':blog_id')
  async deleteBlog(
    @ValidUser() { id: user_id }: User,
    @Param('blog_id', ParseIntPipe) blog_id: number,
  ) {
    const foundBlog = await this.blogsService.findBlogById(blog_id);
    if (!foundBlog) {
      throw new HttpException('BLOG NOT FOUND', HttpStatus.NOT_FOUND);
    }

    if (foundBlog.user_id !== user_id) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }

    await this.blogsService.deleteBlog(blog_id);

    return { message: 'SUCCESS' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':blog_id/bookmarks')
  async createOrUpdateBookmark(
    @ValidUser() { id: user_id }: User,
    @Param('blog_id', ParseIntPipe) blog_id: number,
  ) {
    const foundBlog = await this.blogsService.findBlogById(blog_id);
    if (!foundBlog) {
      throw new HttpException('BLOG NOT FOUND', HttpStatus.NOT_FOUND);
    }

    const { raw } = await this.bookmarksService.createOrUpdateBookmark(
      user_id,
      blog_id,
    );

    if (!raw) {
      throw new HttpException(
        'CREATE OR UPDATE BLOG FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'SUCCESS' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':blog_id/likes')
  async createOrUpdateLike(
    @ValidUser() { id: user_id }: User,
    @Param('blog_id', ParseIntPipe) blog_id: number,
  ) {
    const foundBlog = await this.blogsService.findBlogById(blog_id);
    if (!foundBlog) {
      throw new HttpException('BLOG NOT FOUND', HttpStatus.NOT_FOUND);
    }

    const { raw } = await this.likesService.createOrUpdateLike(
      user_id,
      blog_id,
    );

    if (!raw) {
      throw new HttpException(
        'CREATE OR UPDATE BLOG FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { message: 'SUCCESS' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/likes')
  async getLikedBlogsByUser(@ValidUser() { id: user_id }: User) {
    return this.blogsService.findBlogsByUser(
      user_id,
      FIND_BLOGS_BY_USER_INPUT.LIKE,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/bookmarks')
  async getBookmarkedBlogsByUser(@ValidUser() { id: user_id }: User) {
    return this.blogsService.findBlogsByUser(
      user_id,
      FIND_BLOGS_BY_USER_INPUT.BOOKMARK,
    );
  }
}
