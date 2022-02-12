export class BatchRankResponse {
  userId: string;
  userName: string;
  userThumbnail: string;
  blogCount: number;
}

export class UsersContributionResponse extends BatchRankResponse {
  penalty: number;
}

export class WeekBlog {
  blogWrittenDate: string;
  batchId: number;
  userId: number;
  userName: number;
  blogTitle: string;
  blogLink: string;
  blogTypeName: string;
}

export class WeekBlogsResponse {
  sun?: WeekBlog[];
  sat?: WeekBlog[];
  fri?: WeekBlog[];
  thu?: WeekBlog[];
  wed?: WeekBlog[];
  tue?: WeekBlog[];
  mon?: WeekBlog[];
}
