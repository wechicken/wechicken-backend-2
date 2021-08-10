import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Blog } from 'src/blogs/blog.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Like {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  blog_id: number;

  @Column({ type: 'boolean' })
  status: boolean;

  @ManyToOne(() => User, (user) => user.likes, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.likes, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
