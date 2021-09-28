import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Blog } from 'src/blogs/blog.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Bookmark {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  blog_id: number;

  @Column({ type: 'boolean' })
  status: boolean;

  @ManyToOne(() => User, (user) => user.bookmarks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.bookmarks)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
