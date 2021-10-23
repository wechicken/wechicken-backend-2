import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeRepository } from './like.repository';
import { LikesService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([LikeRepository])],
  providers: [LikesService],
  exports: [LikesService, TypeOrmModule],
})
export class LikesModule {}
