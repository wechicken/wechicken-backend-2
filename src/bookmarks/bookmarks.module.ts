import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarkRepository } from './bookmark.repository';
import { BookmarksService } from './bookmarks.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookmarkRepository])],
  providers: [BookmarksService],
  exports: [BookmarksService, TypeOrmModule],
})
export class BookmarksModule {}
