import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ko from 'dayjs/locale/ko';

@Injectable()
export class DaysService {
  constructor() {
    dayjs.extend(relativeTime);
    dayjs.locale({
      ...ko,
      weekStart: 1,
    });
  }

  getFirstDateOfWeek(date: string): string {
    return dayjs(date).startOf('week').format('YYYY-MM-DD');
  }

  getLastDateOfWeek(date: string): string {
    return dayjs(date).endOf('week').format('YYYY-MM-DD');
  }

  getDayOfDate(date: string): string {
    const DAY_KOR_TO_ENG = {
      월: 'MON',
      화: 'TUE',
      수: 'WED',
      목: 'THU',
      금: 'FRI',
      토: 'SAT',
      일: 'SUN',
    };

    return DAY_KOR_TO_ENG[dayjs(date).format('ddd')];
  }

  getDateForm(date: string): string {
    return dayjs(date).format('YYYY-MM-DD');
  }
}
