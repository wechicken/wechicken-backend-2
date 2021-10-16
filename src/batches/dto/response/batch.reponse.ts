import { ApiProperty } from '@nestjs/swagger';

export class BatchRankResponse {
  @ApiProperty({ description: '유저 ID' })
  userId: string;

  @ApiProperty({ description: '유저 이름' })
  userName: string;

  @ApiProperty({ description: '유저 프로필사진' })
  userThumbnail: string;

  @ApiProperty({ description: '블로그 개수' })
  blogCount: number;
}

export class UsersContributionResponse extends BatchRankResponse {
  @ApiProperty({ description: '기부금' })
  penalty: number;
}

export class WeekBlog {
  @ApiProperty({ description: '게시글 작성일' })
  blogWrittenDate: string;

  @ApiProperty({ description: '기수 ID' })
  batchId: number;

  @ApiProperty({ description: '유저 ID' })
  userId: number;

  @ApiProperty({ description: '유저 이름' })
  userName: number;

  @ApiProperty({ description: '게시글 이름' })
  blogTitle: string;

  @ApiProperty({ description: '게시글 링크' })
  blogLink: string;

  @ApiProperty({ description: '블로그 카테고리' })
  blogTypeName: string;
}

export class WeekBlogsResponse {
  @ApiProperty({
    description: '일요일 유저별 게시글',
    type: [WeekBlog],
    required: false,
  })
  sun?: WeekBlog[];

  @ApiProperty({
    description: '토요일 유저별 게시글',
    type: [WeekBlog],
    required: false,
  })
  sat?: WeekBlog[];

  @ApiProperty({
    description: '금요일 유저별 게시글',
    type: [WeekBlog],
    required: false,
  })
  fri?: WeekBlog[];

  @ApiProperty({
    description: '목요일 유저별 게시글',
    type: [WeekBlog],
    required: false,
  })
  thu?: WeekBlog[];

  @ApiProperty({
    description: '수요일 유저별 게시글',
    type: [WeekBlog],
    required: false,
  })
  wed?: WeekBlog[];

  @ApiProperty({
    description: '화요일 유저별 게시글',
    type: [WeekBlog],
    required: false,
  })
  tue?: WeekBlog[];

  @ApiProperty({
    description: '월요일 유저별 게시글',
    type: [WeekBlog],
    required: false,
  })
  mon?: WeekBlog[];
}
