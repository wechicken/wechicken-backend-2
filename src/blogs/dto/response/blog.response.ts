class BlogType {
  name: string;
}

class BatchType {
  name: string;
}

class Batch {
  nth: number;
  batchType: BatchType;
}

class User {
  id: number;
  name: string;
  batch: Batch;
  blogType: BlogType;
}

export class Blog {
  id: number;
  title: string;
  subtitle: string;
  link: string;
  thumbnail: string;
  writtenDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isBookmarked: boolean;
  isLiked: boolean;
  userId: number;
  user: User;
}

export class GetBlogsResponse {
  data: Blog[];
}

export class PostApiResponse {
  message: string;
}
