import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthMoudle } from 'src/auth/auth.module';
import { BatchesModule } from 'src/batches/batches.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    BatchesModule,
    forwardRef(() => AuthMoudle),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
