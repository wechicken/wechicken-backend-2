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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly blogsService: BlogsService,
    private readonly uploadService: UploadService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getUser(@ValidUser() { id: userId }: User) {
    return this.usersService.findUserByUnique({ id: userId });
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

    const {
      id,
      batch_id,
      thumbnail,
      is_manager,
      is_group_joined,
      batch: { nth },
    } = foundUser;

    const token = await this.authService.createToken(id, batch_id);

    return {
      message: 'SUCCESS',
      data: {
        token,
        profile: thumbnail,
        is_manager,
        is_group_joined,
        nth,
      },
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

    const {
      id,
      batch_id,
      thumbnail,
      is_manager,
      is_group_joined,
      batch: { nth },
    } = foundUser;

    const token = await this.authService.createToken(id, batch_id);

    return {
      message: 'SUCCESS',
      data: {
        token,
        profile: thumbnail,
        is_manager,
        is_group_joined,
        nth,
      },
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

    const {
      id,
      batch_id,
      thumbnail,
      is_manager,
      is_group_joined,
      batch: { nth },
    } = createdUser;

    const token = await this.authService.createToken(id, batch_id);

    return {
      message: 'SUCCESS',
      data: {
        token,
        thumbnail,
        is_manager,
        is_group_joined,
        nth,
      },
    };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profile_file'))
  async update(
    @ValidUser() { id: userId, gmail }: User,
    @Body() { blog_address }: { blog_address: string },
    @UploadedFile() profile_file?: Express.Multer.File,
  ) {
    const updatedUser: UpdateUserInput = {
      ...(blog_address && { blog_address }),
      ...(profile_file && {
        thumbnail: await this.uploadService.fileUpload(gmail, profile_file),
      }),
    };

    await this.usersService.updateUser(userId, updatedUser);

    return { message: 'SUCCESS' };
  }
}
