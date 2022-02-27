import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleAuthClient: OAuth2Client;
  private readonly GOOGLE_AUTH_CLIENT_ID: string;
  private readonly GOOGLE_AUTH_SECRET_KEY: string;

  // @Inject('GOOGLE_AUTH_CLIENT_ID') GOOGLE_AUTH_CLIENT_ID: string,
  // @Inject('GOOGLE_AUTH_SECRET_KEY') GOOGLE_AUTH_SECRET_KEY: string,
  constructor(private readonly jwtService: JwtService) {
    this.GOOGLE_AUTH_CLIENT_ID = 'CLIENT_ID';
    this.GOOGLE_AUTH_SECRET_KEY = 'CLIENT_SECRET';
    this.googleAuthClient = new OAuth2Client(
      this.GOOGLE_AUTH_CLIENT_ID,
      this.GOOGLE_AUTH_SECRET_KEY,
    );
  }

  async login(userId: number) {
    const payload = { userId };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async getGoogleAuth(googleToken: string) {
    try {
      const ticket = await this.googleAuthClient.verifyIdToken({
        idToken: googleToken,
        audience: this.GOOGLE_AUTH_CLIENT_ID,
      });

      return ticket.getPayload();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createToken(userId: number, batchNth: number) {
    return this.jwtService.sign({ userId, batchNth });
  }
}
