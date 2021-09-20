import { Injectable } from '@nestjs/common';
import { BookmarkRepository } from './bookmark.repository';

@Injectable()
export class BookmarksService {
  constructor(private readonly bookmarkRepository: BookmarkRepository) {}

  async createOrUpdateBookmark(user_id: number, blog_id: number) {
    const foundBookmark = await this.bookmarkRepository.findBookmarkByUniqueKey(
      user_id,
      blog_id,
    );

    if (!foundBookmark)
      return this.bookmarkRepository.createBookmark(user_id, blog_id);

    return this.bookmarkRepository.updateStatus(foundBookmark);
  }
}
