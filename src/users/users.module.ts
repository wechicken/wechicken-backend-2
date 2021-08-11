import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { BatchesModule } from '../batches/batches.module';
import { BatchesService } from 'src/batches/batches.service';
import { AuthMoudle } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    BatchesModule,
    AuthMoudle,
  ],
  controllers: [UsersController],
  providers: [UsersService, BatchesService],
})
export class UsersModule {}
