import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleAuthClient: OAuth2Client;
  constructor(private readonly jwtService: JwtService) {
    this.googleAuthClient = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID);
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
      console.log(process.env.GOOGLE_AUTH_CLIENT_ID);
      const ticket = await this.googleAuthClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_AUTH_CLIENT_ID,
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
