import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

const isObject = (v: any): boolean => {
  return v !== null && typeof v === 'object' && v.constructor === Object;
};

const isArray = (v: any): boolean => Array.isArray(v);

const object = (acc: Record<string, any>, [k, v]: [string, any]) => ({
  ...acc,
  [k]: v,
});

const toCamelCase = (key: string): string => {
  return key
    .toLowerCase()
    .replace(/[_][a-z]/g, (match) => match.toUpperCase().replace('_', ''));
};

@Injectable()
export class CamelCaseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const keyToCamelcase = ([k, v]: [string, any]): [string, any] => {
      return [toCamelCase(k), transformDataToCamelCase(v)];
    };

    const deepObjectKeysToCamelCase = (
      data: Record<string, any>,
    ): Record<string, any> => {
      return Object.entries(data).map(keyToCamelcase).reduce(object, {});
    };

    const transformDataToCamelCase = (data: any) => {
      if (isArray(data)) return data.map(deepObjectKeysToCamelCase);
      if (isObject(data)) return deepObjectKeysToCamelCase(data);

      return data;
    };

    return next
      .handle()
      .pipe(map((data) => ({ data: transformDataToCamelCase(data) })));
  }
}
