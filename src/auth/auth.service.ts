import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(userId: number) {
    const payload = { userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
