import { Injectable } from '@nestjs/common';
import { BatchesService } from 'src/batches/batches.service';
import { CreateUserInput } from './dto/input/create-user.input';
import { UserUniqueSearchParams } from './dto/params/user-unique-search.params';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UpdateUserInput } from './dto/input/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private batchesService: BatchesService,
  ) {}

  async findUserByUnique(data: UserUniqueSearchParams): Promise<User> {
    return this.userRepository.findUserByUnique(data);
  }

  async createUser(createUserInput: CreateUserInput) {
    const { nth, batch_type_id, ...userFields } = createUserInput;

    const batch = await this.batchesService.findOrCreateBatch(
      batch_type_id,
      nth,
    );

    return this.userRepository.createAndSaveUser(batch, userFields);
  }

  async updateUser(userId: number, data: UpdateUserInput) {
    return this.userRepository.update(userId, data);
  }
}
