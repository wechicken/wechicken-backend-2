import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // 환경변수로 후에 주입해야 함
    }),
    forwardRef(() => UsersModule),
    HttpModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'GOOGLE_AUTH_CLIENT_ID',
      useValue: process.env.GOOGLE_AUTH_CLIENT_ID,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
