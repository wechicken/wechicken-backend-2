import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async login(userId: number) {
    const payload = { userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getGoogleAuth(googleToken: string) {
    const observableResponse = this.httpService.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`,
    );
    console.log('');
    const response = await firstValueFrom(observableResponse);

    console.log(response);
    return response.data;
  }

  async createToken(userId: number, batchNth: number) {
    return this.jwtService.sign({ userId, batchNth });
  }
}
