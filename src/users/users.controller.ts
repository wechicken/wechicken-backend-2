import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
  Query,
  Get,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UserUniqueSearchInput } from './dto/input/user-unique-search.input';
import { UsersService } from './users.service';
import {
  LoginParams,
  // UserLoginResponse,
  // UserTestLoginResponse,
} from './dto/reponse/user-login.response';
// import {
//   ApiCreatedResponse,
//   ApiOkResponse,
//   ApiOperation,
//   ApiTags,
// } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidUser } from '../auth/decorator/ValidUser';
import { User } from './user.entity';
import { UploadService } from '../upload/upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BlogsService } from '../blogs/blogs.service';
import { PagingInput } from '../blogs/dto/input/blog-search.input';

@Controller('users')
// @ApiTags('유저 API')
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
  // @ApiOperation({
  //   summary: '테스트시, 유저 로그인 API',
  //   description: '가입된 유저이메일로 로그인 가능',
  // })
  // @ApiOkResponse({ type: UserTestLoginResponse })
  async logIn(@Body() userUniqueSearchInput: UserUniqueSearchInput) {
    const { gmail } = userUniqueSearchInput;
    const foundUser = await this.usersService.findUserByUnique({ gmail });

    if (!foundUser) {
      throw new HttpException('가입되지 않은 사용자', HttpStatus.NOT_FOUND);
    }

    return this.authService.login(foundUser.id);
  }

  @Post('login/google')
  // @ApiOperation({
  //   summary: '구글 소셜 로그인 API',
  //   description: '구글 소셜 로그인',
  // })
  // @ApiOkResponse({ type: UserLoginResponse })
  async googleLogin(@Body() googleToken: string) {
    const googleUser: { sub: string; email: string } =
      await this.authService.getGoogleAuth(googleToken);

    const foundUser = await this.usersService.findUserByUnique({
      gmail_id: googleUser.sub,
    });

    if (!foundUser) {
      return new HttpException({ message: 'FIRST' }, HttpStatus.OK);
    }

    const token = await this.authService.createToken(
      foundUser.id,
      foundUser.batch.nth,
    );

    const result = new LoginParams(foundUser, token);

    return new HttpException(
      { message: 'SUCCESS', data: result },
      HttpStatus.OK,
    );
  }

  @Post('signUp')
  // @ApiOperation({
  //   summary: '추가정보 및 회원생성 API',
  //   description: '구글 첫 소셜 로그인 시 추가 정보 후 회원을 생성한다.',
  // })
  // @ApiCreatedResponse({ type: UserLoginResponse })
  async signUp(@Body() createUserInput: CreateUserInput) {
    const foundUser = await this.usersService.findUserByUnique({
      gmail: createUserInput.gmail,
    });
    if (foundUser) {
      throw new HttpException('이미 가입된 사용자', HttpStatus.CONFLICT);
    }

    const createdUser = await this.usersService.createUser(createUserInput);
    const token = await this.authService.createToken(
      createdUser.id,
      createdUser.batch.nth,
    );

    const result = new LoginParams(createdUser, token);

    return new HttpException(
      { message: 'SUCCESS', data: result },
      HttpStatus.OK,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile-upload')
  @UseInterceptors(FileInterceptor('profileFile'))
  async updateUserProfile(
    @ValidUser() { id: userId, gmail }: User,
    @UploadedFile() profileFile: Express.Multer.File,
  ) {
    const imageUrl = await this.uploadService.fileUpload(gmail, profileFile);

    await this.usersService.updateUser(userId, { thumbnail: imageUrl });

    return { message: 'SUCCESS' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('blog-address')
  async updateUserBlogAddress(
    @ValidUser() { id: userId }: User,
    @Body() { blogAddress }: { blogAddress: string },
  ) {
    await this.usersService.updateUser(userId, { blog_address: blogAddress });

    return { message: 'SUCCESS' };
  }
}
