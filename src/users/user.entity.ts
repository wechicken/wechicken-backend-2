import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Batch } from 'src/batches/batch.entity';
import { BlogType } from 'src/blogs/blog-type.entity';
import { Bookmark } from 'src/bookmarks/bookmark.entity';
import { Like } from 'src/likes/like.entity';
import { Tag } from 'src/tags/tag.entity';
import { Blog } from 'src/blogs/blog.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  gmail_id: string;

  @Column({ type: 'varchar', unique: true })
  gmail: string;

  @Column({ type: 'varchar', length: 2000 })
  blog_address: string;

  @Column({ type: 'varchar', length: 45 })
  name: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  thumbnail: string;

  @Column({ type: 'boolean', default: false })
  is_manager: boolean;

  @Column({ type: 'boolean', default: false })
  is_group_joined: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Batch, (batch) => batch.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column()
  batch_id: number;

  @ManyToOne(() => BlogType, (blogType) => blogType.users, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'blog_type_id' })
  blogType: BlogType;

  @ManyToMany(() => User, (user) => user.following, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'follow',
    joinColumn: {
      name: 'follwer_id',
    },
    inverseJoinColumn: {
      name: 'following_id',
    },
  })
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers, {
    createForeignKeyConstraints: false,
  })
  following: User[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user, {
    createForeignKeyConstraints: false,
  })
  bookmarks: Bookmark[];

  @OneToMany(() => Like, (like) => like.user, {
    createForeignKeyConstraints: false,
  })
  likes: Like[];

  @OneToMany(() => Tag, (tag) => tag.user, {
    createForeignKeyConstraints: false,
  })
  tags: Tag[];

  @OneToMany(() => Blog, (blog) => blog.user, {
    createForeignKeyConstraints: false,
  })
  blogs: Blog[];
}
