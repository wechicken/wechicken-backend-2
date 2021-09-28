import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UserUniqueSearchInput } from './dto/input/user-unique-search.input';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { LoginParams } from './dto/reponse/user-login.response';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('test/signup')
  async signUpByTestUser(
    @Body() createUserInput: CreateUserInput,
  ): Promise<User> {
    const { gmail } = createUserInput;
    const foundUser = await this.usersService.findUserByUnique({ gmail });

    if (foundUser) {
      throw new HttpException('이미 가입된 사용자', HttpStatus.CONFLICT);
    }

    return this.usersService.createUser(createUserInput);
  }

  @Post('test/login')
  async logIn(@Body() userUniqueSearchInput: UserUniqueSearchInput) {
    const { gmail } = userUniqueSearchInput;
    const foundUser = await this.usersService.findUserByUnique({ gmail });

    if (!foundUser) {
      throw new HttpException('가입되지 않은 사용자', HttpStatus.NOT_FOUND);
    }

    return this.authService.login(foundUser.id);
  }

  @Post('login/google')
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
}
