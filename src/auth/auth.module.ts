import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/users/users.module';

console.log('AUTH MODULE');
console.log('GOOGLE_AUTH_CLIENT_ID', process.env.GOOGLE_AUTH_CLIENT_ID);
console.log('GOOGLE_AUTH_SECRET_KEY', process.env.GOOGLE_AUTH_SECRET_KEY);
console.log('DB HOST', process.env.DB_HOST);

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY', // 환경변수로 후에 주입해야 함
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    // {
    //   provide: 'GOOGLE_AUTH_CLIENT_ID',
    //   useValue: process.env.GOOGLE_AUTH_CLIENT_ID,
    // },
    // {
    //   provide: 'GOOGLE_AUTH_SECRET_KEY',
    //   useValue: process.env.GOOGLE_AUTH_SECRET_KEY,
    // },
  ],
  exports: [AuthService],
})
export class AuthModule {}
