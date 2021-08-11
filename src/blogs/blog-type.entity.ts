import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export type BlogTypeName = 'VELOG' | 'MEDIUM' | 'TISTORY' | 'GITHUB' | '기타';

@Entity()
export class BlogType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: BlogTypeName;

  @OneToMany(() => User, (user) => user.blogType)
  users: User[];
}
