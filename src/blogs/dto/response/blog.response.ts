import { ApiProperty } from '@nestjs/swagger';

class BlogType {
  @ApiProperty({ description: '블로그 유형' })
  name: string;
}

class BatchType {
  @ApiProperty({ description: '기수 유형' })
  name: string;
}

class Batch {
  @ApiProperty({ description: '기수' })
  nth: number;

  batchType: BatchType;
}

class User {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '유저 이름' })
  name: string;

  @ApiProperty({ description: '기수' })
  batch: Batch;

  @ApiProperty({ description: '블로그 유형' })
  blogType: BlogType;
}

export class Blog {
  @ApiProperty({ description: 'ID' })
  id: number;

  @ApiProperty({ description: '제목' })
  title: string;

  @ApiProperty({ description: '부제목' })
  subtitle: string;

  @ApiProperty({ description: '주소' })
  link: string;

  @ApiProperty({ description: '게시글 썸네일' })
  thumbnail: string;

  @ApiProperty({ description: '게시글 작성일' })
  writtenDate: Date;

  @ApiProperty({ description: '게시글 생성일' })
  createdAt: Date;

  @ApiProperty({ description: '게시글 수정일' })
  updatedAt: Date;

  @ApiProperty({ description: '게시글 삭제일' })
  deletedAt: Date;

  @ApiProperty({ description: '북마크 여부' })
  isBookmarked: boolean;

  @ApiProperty({ description: '좋아요 여부' })
  isLiked: boolean;

  @ApiProperty({ description: '유저 ID' })
  userId: number;

  @ApiProperty({ description: '유저', type: User })
  user: User;
}

export class GetBlogsResponse {
  @ApiProperty({ description: '게시글 목록', type: [Blog] })
  data: Blog[];
}

export class PostApiResponse {
  @ApiProperty({ description: '결과 메시지' })
  message: string;
}
