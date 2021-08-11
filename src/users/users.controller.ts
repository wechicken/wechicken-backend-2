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

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserInput: CreateUserInput): Promise<User> {
    const { gmail } = createUserInput;
    const foundUser = await this.usersService.findUserByUnique({ gmail });

    if (foundUser) {
      throw new HttpException('이미 가입된 사용자', HttpStatus.CONFLICT);
    }

    return this.usersService.createUser(createUserInput);
  }

  @Post('login')
  async logIn(@Body() userUniqueSearchInput: UserUniqueSearchInput) {
    const { gmail } = userUniqueSearchInput;
    const foundUser = await this.usersService.findUserByUnique({ gmail });

    if (!foundUser) {
      throw new HttpException('가입되지 않은 사용자', HttpStatus.NOT_FOUND);
    }

    return this.authService.login(foundUser.id);
  }
}
