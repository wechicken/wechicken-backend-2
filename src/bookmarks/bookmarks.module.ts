import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';

@Module({
  providers: [BookmarksService],
})
export class BookmarksModule {}
