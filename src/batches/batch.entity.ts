import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BatchType } from './batch-type.entity';

@Entity()
export class Batch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  nth: number;

  @Column({ type: 'varchar', length: 45, nullable: true })
  title: string;

  @Column({ type: 'int', nullable: true })
  penalty: number;

  @Column({ type: 'int', nullable: true })
  count_per_week: number;

  @Column({ type: 'boolean', default: false })
  is_page_opened: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => BatchType, (batchType) => batchType.batches, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'batch_type_id' })
  batchType: BatchType;

  @Column()
  batch_type_id: number;

  @OneToMany(() => User, (user) => user.batch, {
    createForeignKeyConstraints: false,
  })
  users: User[];

  @Column({ nullable: true, comment: '치킨계장 user.id' })
  manger_id: number;
}
