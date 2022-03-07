import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserUniqueSearchParams } from './dto/params/user-unique-search.params';
import { CreateUserInput } from './dto/input/create-user.input';
import { Batch } from 'src/batches/batch.entity';
import * as F from 'fxjs/Strict';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findUserByUnique(data: UserUniqueSearchParams): Promise<User> {
    const [query, queryParam] = F.go(
      data,
      F.entries,
      ([tuple]) => tuple,
      ([k, v]) => [`user.${k} = :${k}`, { [k]: v }],
    );

    return this.createQueryBuilder('user')
      .select(['user', 'batch.nth', 'batch.title'])
      .innerJoin('user.batch', 'batch')
      .where(query, queryParam)
      .getOne();
  }

  createAndSaveUser(
    batch: Batch,
    userFields: Omit<CreateUserInput, 'nth' | 'batch_type_id'>,
  ): Promise<User> {
    const user = this.create({ ...userFields, batch });

    return this.save(user);
  }
}
