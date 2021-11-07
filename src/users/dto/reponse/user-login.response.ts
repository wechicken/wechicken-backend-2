import { User } from '../../user.entity';
// import { ApiProperty } from '@nestjs/swagger';

export class LoginParams {
  // @ApiProperty({ description: '토큰' })
  token: string;

  // @ApiProperty({ description: '프로필사진' })
  profile?: string;

  // @ApiProperty({ description: '나의 기수 상태' })
  isMyGroupStatus: boolean;

  // @ApiProperty({ description: '기수' })
  nth: number;

  // @ApiProperty({ description: '기수 관리자여부' })
  isMaster: boolean;

  constructor(user: User, token: string) {
    this.token = token;
    this.profile = user.thumbnail;
    this.isMyGroupStatus = user.is_group_joined;
    this.nth = user.batch.nth;
    this.isMaster = user.id === user.batch.manager_id;
  }
}

export class UserLoginResponse {
  // @ApiProperty({ description: '메시지' })
  message: string;

  // @ApiProperty({ description: '로그인 정보' })
  data: LoginParams;
}

export class UserTestLoginResponse {
  // @ApiProperty({ description: '토큰' })
  token: string;
}
