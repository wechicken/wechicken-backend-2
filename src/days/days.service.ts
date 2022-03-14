import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ko from 'dayjs/locale/ko';

@Injectable()
export class DaysService {
  private readonly MAX_TOKEN_LIFETIME_SECS = 86400;

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

  getISOString(date: string): string {
    return dayjs(date).toISOString();
  }

  getDateForm(date: string | Date): string {
    return dayjs(date).format('YYYY-MM-DD');
  }

  isTokenValidByExpiredTime(exp: number): boolean {
    const now = new Date().getTime() / 1000;
    return exp < now + this.MAX_TOKEN_LIFETIME_SECS;
  }
}
