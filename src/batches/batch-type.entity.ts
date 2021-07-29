import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Batch } from './batch.entity';

export type BatchTypeName = '오프라인 부트캠프' | '온라인 부트캠프' | '기타';

@Entity()
export class BatchType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: BatchTypeName;

  @OneToMany(() => Batch, (batch) => batch.batchType)
  batches: Batch[];
}
