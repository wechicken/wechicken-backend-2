import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Bookmark } from 'src/bookmarks/bookmark.entity';
import { Like } from 'src/likes/like.entity';
import { Tag } from 'src/tags/tag.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  subtitle: string;

  @Column({ type: 'varchar', length: 2000 })
  link: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  thumbnail: string;

  @Column({ type: 'date' })
  written_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.blog)
  bookmarks: Bookmark[];

  @OneToMany(() => Like, (like) => like.blog)
  likes: Like[];

  @OneToMany(() => Tag, (tag) => tag.blog)
  tags: Tag[];

  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: number;
}

export interface BlogResponse extends Omit<Blog, 'bookmarks' | 'likes'> {
  isLiked: boolean;

  isBookmarked: boolean;
}
