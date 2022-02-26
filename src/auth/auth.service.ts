import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleAuthClient: OAuth2Client;
  constructor(private readonly jwtService: JwtService) {
    this.googleAuthClient = new OAuth2Client(process.env.CLIENT_ID);
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
        audience: process.env.CLIENT_ID,
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
