import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogRepository } from './blog.repository';
import { BookmarksService } from 'src/bookmarks/bookmarks.service';
import { BookmarksModule } from 'src/bookmarks/bookmarks.module';
import { LikesModule } from 'src/likes/likes.module';
import { LikesService } from 'src/likes/likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogRepository]),
    BookmarksModule,
    LikesModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BookmarksService, LikesService],
})
export class BlogsModule {}
