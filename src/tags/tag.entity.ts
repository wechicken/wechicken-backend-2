import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Blog } from 'src/blogs/blog.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Tag {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  blog_id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.tags)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.tags)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
