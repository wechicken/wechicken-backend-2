import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { BatchesModule } from '../batches/batches.module';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from '../upload/upload.module';
import { BlogsModule } from '../blogs/blogs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    BatchesModule,
    UploadModule,
    BlogsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
