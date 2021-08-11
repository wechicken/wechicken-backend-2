import { Injectable } from '@nestjs/common';
import { BatchesService } from 'src/batches/batches.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UserUniqueSearchParams } from './dto/params/user-unique-search.params';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private userRepositry: UserRepository,
    private batchesService: BatchesService,
  ) {}

  findUserByUnique(data: UserUniqueSearchParams): Promise<User> {
    return this.userRepositry.findUserByUnique(data);
  }

  async createUser(createUserInput: CreateUserInput) {
    const { nth, batch_type_id, ...userFields } = createUserInput;

    const batch = await this.batchesService.findOrCreateBatch(
      batch_type_id,
      nth,
    );

    return this.userRepositry.createAndSaveUser(batch, userFields);
  }
}
