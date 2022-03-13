import { Injectable } from '@nestjs/common';
import { DaysService } from 'src/days/days.service';
import { Batch } from './batch.entity';
import { BatchRepository } from './batch.repository';
import * as F from 'fxjs/Strict';
import * as L from 'fxjs/Lazy';

const typeCasting = F.curry(({ targetKey, type }, obj) =>
  F.go(
    obj,
    L.entries,
    L.map(([k, v]) => [k, k === targetKey ? type(v) : v]),
    F.object,
  ),
);

L.merge = F.curry(({ targetArr, joinKey }, arr) => {
  const targetObj = F.go(
    targetArr,
    F.indexBy((el) => el[joinKey]),
  );

  return F.go(
    arr,
    L.map((el) => F.extend(el, targetObj[el[joinKey]])),
  );
});

@Injectable()
export class BatchesService {
  constructor(
    private readonly batchRepository: BatchRepository,
    private readonly daysService: DaysService,
  ) {}

  async findOrCreateBatch(batch_type_id: number, nth: number): Promise<Batch> {
    const foundBatch = await this.batchRepository.findOne({
      batch_type_id,
      nth,
    });

    if (foundBatch) return foundBatch;

    return this.batchRepository.createAndSaveBatch(batch_type_id, nth);
  }

  async getBatchRanks(batch_id: number) {
    return F.go(
      this.batchRepository.getTopThreeUsersByBlogCount(batch_id),
      F.map(typeCasting({ targetKey: 'blogs_count', type: Number })),
    );
  }

  async getUsersContributionByWeek(batch_id: number, selected_date: string) {
    const [from, to] = [
      this.daysService.getFirstDateOfWeek(selected_date),
      this.daysService.getLastDateOfWeek(selected_date),
    ];

    const blogCountsByUserId = await this.batchRepository.getBlogCountsByUserId(
      batch_id,
      from,
      to,
    );

    const blogCounts = F.go(
      blogCountsByUserId,
      L.map(typeCasting({ targetKey: 'blogs_count', type: Number })),
    );

    const usersOfBatch = await this.batchRepository.getUsersOfBatch(batch_id);

    const calculatePenalty = (user) => ({
      ...user,
      penalty:
        user.blogs_count >= user.batch_count_per_week
          ? 0
          : (user.batch_count_per_week - user.blogs_count) * user.batch_penalty,
    });

    return F.go(
      usersOfBatch,
      L.map(F.extendRight({ blogs_count: 0 })),
      L.merge({ targetArr: blogCounts, joinKey: 'user_id' }),
      L.map(calculatePenalty),
      L.map(F.omit(['batch_count_per_week', 'batch_penalty'])),
      F.sortByDesc('penalty'),
    );
  }

  async getBlogsOfWeek(batch_id: number, selected_date: string) {
    const [from, to] = [
      this.daysService.getFirstDateOfWeek(selected_date),
      this.daysService.getLastDateOfWeek(selected_date),
    ];

    const blogs = await this.batchRepository.getBlogsOfWeek(batch_id, from, to);

    const handleDate = ({ blog_written_date, ...blog }) => ({
      blog_written_date: this.daysService.getDateForm(blog_written_date),
      day_of_date: this.daysService.getDayOfDate(blog_written_date),
      ...blog,
    });

    return F.go(
      blogs,
      L.map(handleDate),
      F.groupBy(({ day_of_date }) => day_of_date),
      F.mapObject(
        F.pipe(L.map(F.omit(['day_of_date'])), F.sortBy(['user_name'])),
      ),
    );
  }
}
