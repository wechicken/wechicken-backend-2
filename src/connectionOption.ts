import { BatchType } from './batches/batch-type.entity';
import { Batch } from './batches/batch.entity';
import { Blog } from './blogs/blog.entity';
import { Bookmark } from './bookmarks/bookmark.entity';
import { Like } from './likes/like.entity';
import { Tag } from './tags/tag.entity';
import { User } from './users/user.entity';
import { BlogType } from './blogs/blog-type.entity';
import { ConnectionOptions } from 'typeorm';

export const connectionOption: ConnectionOptions & {
  keepConnectionAlive?: boolean;
} = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [BatchType, Batch, Blog, Bookmark, Like, Tag, User, BlogType],
  keepConnectionAlive: true,
  synchronize: false,
  logging: true,
};
