import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { HttpService } from '@nestjs/axios';
import { DaysService } from '../days/days.service';
import * as F from 'fxjs/Strict';

@Injectable()
export class AuthService {
  private readonly googleAuthClient: OAuth2Client;
  private readonly GOOGLE_AUTH_CLIENT_ID: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly daysService: DaysService,
    @Inject('GOOGLE_AUTH_CLIENT_ID') GOOGLE_AUTH_CLIENT_ID: string,
  ) {
    this.GOOGLE_AUTH_CLIENT_ID = GOOGLE_AUTH_CLIENT_ID;

    this.googleAuthClient = new OAuth2Client(this.GOOGLE_AUTH_CLIENT_ID);
  }

  async login(userId: number) {
    const payload = { userId };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async getGoogleAuth(googleToken: string) {
    return this.verifyIdToken(googleToken);
  }

  async createToken(userId: number, batchNth: number) {
    return this.jwtService.sign({ userId, batchNth });
  }

  verifyIdToken(googleToken: string): TokenPayload {
    const decodedPayload = this.jwtService.decode(googleToken, {
      json: true,
    }) as TokenPayload;

    const { aud, iss, exp } = decodedPayload;

    const conditions = {
      iss: 'accounts.google.com' === iss,
      aud: this.GOOGLE_AUTH_CLIENT_ID === aud,
      exp: this.daysService.isTokenValidByExpiredTime(exp),
    };

    return F.go(
      conditions,
      F.values,
      F.every((v) => v === true),
      F.ifElse(
        (v) => v === true,
        () => decodedPayload,
        () => {
          throw new HttpException(
            'invalid google id token',
            HttpStatus.UNAUTHORIZED,
          );
        },
      ),
    );
  }
}
