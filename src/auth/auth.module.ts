import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // 환경변수로 후에 주입해야 함
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  exports: [AuthService],
})
export class AuthMoudle {}
