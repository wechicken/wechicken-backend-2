import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private googleAuthClient: OAuth2Client;
  private readonly GOOGLE_AUTH_CLIENT_ID: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
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
    try {
      console.log('AUTH SERVICE getGoogleAuth', this.GOOGLE_AUTH_CLIENT_ID);
      console.log('AUTH SERVICE getGoogleAuth', this.googleAuthClient);

      // const ticket = await this.googleAuthClient.verifyIdToken({
      //   idToken: googleToken,
      // });

      // const ticket = await firstValueFrom(
      //   this.httpService.get(
      //     `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`,
      //   ),
      // );

      const observableResponse = this.httpService.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`,
      );
      const response = await firstValueFrom(observableResponse);
      const ticket = response.data;

      console.log(ticket);
      return ticket;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createToken(userId: number, batchNth: number) {
    return this.jwtService.sign({ userId, batchNth });
  }
}
