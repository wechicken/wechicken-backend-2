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
import { BlogsService } from './blogs.service';
import {
  BlogSearchInput,
  BlogPagingInput,
} from './dto/input/blog-search.input';
import { CreateBlogInput } from './dto/input/create-blog.input';
import { UpdateBlogInput } from './dto/input/update-blog.input';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  PostApiResponse,
  GetBlogsResponse,
} from './dto/response/blog.response';

@UseInterceptors(CamelCaseInterceptor)
@ApiTags('블로그 (게시글) API')
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly bookmarksService: BookmarksService,
    private readonly likesService: LikesService,
  ) {}

  @Get()
  @ApiOperation({
    summary: '게시글 목록 조회 API',
    description: '로그인 없이 메인화면 게시글 목록 불러옴',
  })
  @ApiOkResponse({ type: GetBlogsResponse })
  async getBlogs(@Query() blogSearchInput: BlogSearchInput) {
    return this.blogsService.findBlogs(blogSearchInput, null);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('authorization')
  @Get('/auth')
  @ApiOperation({
    summary: '게시글 목록 조회 API',
    description: '로그인 후 메인화면 게시글 목록 불러옴',
  })
  async getBlogsAuth(
    @ValidUser() { id: user_id }: User,
    @Query() blogSearchInput: BlogSearchInput,
  ) {
    return this.blogsService.findBlogs(blogSearchInput, user_id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('authorization')
  @Get('/me')
  @ApiOperation({
    summary: '나의 게시글 목록 조회 API',
    description: '마이페이지 게시글 목록 조회',
  })
  async getUserBlogs(
    @ValidUser() { id: user_id }: User,
    @Query() blogPagingInput: BlogPagingInput,
  ) {
    return this.blogsService.findBlogs(
      { ...blogPagingInput, userId: user_id },
      user_id,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('authorization')
  @Post()
  @ApiOperation({
    summary: '게시글 추가 API',
    description: '게시글을 추가함',
  })
  @ApiCreatedResponse({ type: PostApiResponse })
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
  @ApiBearerAuth('authorization')
  @Put(':blog_id')
  @ApiOperation({
    summary: '게시글 수정 API',
    description: '게시글을 수정함',
  })
  @ApiParam({
    name: 'blog_id',
    description: '게시글 ID',
  })
  @ApiOkResponse({ type: PostApiResponse })
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
  @ApiBearerAuth('authorization')
  @Delete(':blog_id')
  @ApiOperation({
    summary: '게시글 삭제 API',
    description: '게시글을 삭제함',
  })
  @ApiParam({
    name: 'blog_id',
    description: '게시글 ID',
  })
  @ApiOkResponse({ type: PostApiResponse })
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
  @ApiBearerAuth('authorization')
  @Post(':blog_id/bookmarks')
  @ApiOperation({
    summary: '게시글 북마크 추가/제거 API',
    description: '게시글을 나의 북마크에 추가 또는 제거',
  })
  @ApiParam({
    name: 'blog_id',
    description: '게시글 ID',
  })
  @ApiCreatedResponse({ type: PostApiResponse })
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
  @ApiBearerAuth('authorization')
  @Post(':blog_id/likes')
  @ApiOperation({
    summary: '게시글 좋아요 추가/제거 API',
    description: '게시글에 좋아요를 추가 또는 제거',
  })
  @ApiParam({
    name: 'blog_id',
    description: '게시글 ID',
  })
  @ApiCreatedResponse({ type: PostApiResponse })
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
}
