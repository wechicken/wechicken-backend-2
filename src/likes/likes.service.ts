import { Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikeRepository) {}

  async createOrUpdateLike(user_id: number, blog_id: number) {
    const foundLike = await this.likeRepository.findLikeByUniqueKey(
      user_id,
      blog_id,
    );

    if (!foundLike) return this.likeRepository.createLike(user_id, blog_id);

    return this.likeRepository.updateStatus(foundLike);
  }
}
