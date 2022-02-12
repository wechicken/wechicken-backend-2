import { User } from '../../user.entity';

export class LoginParams {
  token: string;

  profile?: string;

  isMyGroupStatus: boolean;

  nth: number;

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
  message: string;

  data: LoginParams;
}

export class UserTestLoginResponse {
  token: string;
}
