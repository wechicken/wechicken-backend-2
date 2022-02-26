import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleAuthClient: OAuth2Client;
  private readonly GOOGLE_AUTH_CLIENT_ID: string;

  constructor(
    private readonly jwtService: JwtService,
    @Inject('GOOGLE_AUTH_CLIENT_ID') GOOGLE_AUTH_CLIENT_ID: string,
  ) {
    this.GOOGLE_AUTH_CLIENT_ID = GOOGLE_AUTH_CLIENT_ID;
    console.log(GOOGLE_AUTH_CLIENT_ID);
    this.googleAuthClient = new OAuth2Client(GOOGLE_AUTH_CLIENT_ID);
  }

  async login(userId: number) {
    const payload = { userId };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async getGoogleAuth(googleToken: string) {
    try {
      console.log(googleToken);
      console.log('injected');
      console.log(this.GOOGLE_AUTH_CLIENT_ID);
      const ticket = await this.googleAuthClient.verifyIdToken({
        idToken: googleToken,
        audience: this.GOOGLE_AUTH_CLIENT_ID,
      });

      return ticket.getPayload();
    } catch (error) {
      console.log(process.env.GOOGLE_AUTH_CLIENT_ID);
      console.log(error);
      throw error;
    }
  }

  async createToken(userId: number, batchNth: number) {
    return this.jwtService.sign({ userId, batchNth });
  }
}
