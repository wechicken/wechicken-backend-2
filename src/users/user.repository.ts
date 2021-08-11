import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserUniqueSearchParams } from './dto/params/user-unique-search.params';
import { CreateUserInput } from './dto/input/create-user.input';
import { Batch } from 'src/batches/batch.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findUserByUnique(data: UserUniqueSearchParams): Promise<User> {
    const [uniqueKey] = Object.keys(data);

    return this.findOne({ [uniqueKey]: data[uniqueKey] });
  }

  createAndSaveUser(
    batch: Batch,
    userFields: Omit<CreateUserInput, 'nth' | 'batch_type_id'>,
  ): Promise<User> {
    const user = this.create({ ...userFields, batch });

    return this.save(user);
  }
}
