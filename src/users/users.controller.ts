import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Query,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UserUniqueSearchInput } from './dto/input/user-unique-search.input';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidUser } from '../auth/decorator/ValidUser';
import { User } from './user.entity';
import { UploadService } from '../upload/upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BlogsService } from '../blogs/blogs.service';
import { PagingInput } from '../blogs/dto/input/blog-search.input';
import { UpdateUserInput } from './dto/input/update-user.input';
import { TokenPayload } from 'google-auth-library';
import { CamelCaseInterceptor } from '../interceptors/CamelCaseInterceptor';

@UseInterceptors(CamelCaseInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly blogsService: BlogsService,
    private readonly uploadService: UploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUser(@ValidUser() { id }: User) {
    const foundUser = await this.usersService.findUserByUnique({ id });
    return this.usersService.createUserResponse(foundUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('blogs')
  async getBlogsOfUser(
    @ValidUser() { id: userId }: User,
    @Query() pagingInput: PagingInput,
  ) {
    return this.blogsService.findBlogs({ ...pagingInput, userId }, userId);
  }

  @Post('test/login')
  async logIn(@Body() userUniqueSearchInput: UserUniqueSearchInput) {
    const { gmail } = userUniqueSearchInput;
    const foundUser = await this.usersService.findUserByUnique({ gmail });

    if (!foundUser) {
      throw new HttpException('가입되지 않은 사용자', HttpStatus.NOT_FOUND);
    }

    const { id, batch_id } = foundUser;
    const token = await this.authService.createToken(id, batch_id);

    return {
      message: 'SUCCESS',
      token,
      ...this.usersService.createUserResponse(foundUser),
    };
  }

  @Post('login/google')
  async googleLogin(@Body() { googleToken }: { googleToken: string }) {
    const googleUser: TokenPayload = await this.authService.getGoogleAuth(
      googleToken,
    );

    const foundUser = await this.usersService.findUserByUnique({
      gmail_id: googleUser.sub,
    });

    if (!foundUser) {
      return new HttpException({ message: 'FIRST' }, HttpStatus.OK);
    }

    const { id, batch_id } = foundUser;
    const token = await this.authService.createToken(id, batch_id);

    return {
      message: 'SUCCESS',
      token,
      ...this.usersService.createUserResponse(foundUser),
    };
  }

  @Post('sign-up')
  async signUp(@Body() createUserInput: CreateUserInput) {
    const foundUser = await this.usersService.findUserByUnique({
      gmail: createUserInput.gmail,
    });

    if (foundUser) {
      throw new HttpException('이미 가입된 사용자', HttpStatus.CONFLICT);
    }

    const createdUser = await this.usersService.createUser(createUserInput);

    const { id, batch_id } = createdUser;
    const token = await this.authService.createToken(id, batch_id);

    return {
      message: 'SUCCESS',
      token,
      ...this.usersService.createUserResponse(createdUser),
    };
  }

  @Patch('blog_address')
  @UseGuards(JwtAuthGuard)
  async patchUserBlogAddress(
    @ValidUser() { id: userId }: User,
    @Body() { blog_address }: { blog_address: string },
  ) {
    const updatedUser: UpdateUserInput = {
      blog_address,
    };

    await this.usersService.updateUser(userId, updatedUser);

    return { message: 'SUCCESS' };
  }

  @Patch('thumbnail')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @ValidUser() { id: userId, gmail }: User,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const uploadedThumbnail = await this.uploadService.fileUpload(gmail, file);

    const updatedUser: UpdateUserInput = {
      thumbnail: uploadedThumbnail,
    };

    await this.usersService.updateUser(userId, updatedUser);

    return { message: 'SUCCESS' };
  }

  @Delete('thumbnail')
  @UseGuards(JwtAuthGuard)
  async deleteUserThumbnail(@ValidUser() { id: userId }: User) {
    const updatedUser: UpdateUserInput = {
      thumbnail: '',
    };

    await this.usersService.updateUser(userId, updatedUser);

    return { message: 'SUCCESS' };
  }
}
