import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ValidUser } from 'src/auth/decorator/ValidUser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CamelCaseInterceptor } from 'src/interceptors/CamelCaseInterceptor';
import { User } from 'src/users/user.entity';
import { BatchesService } from './batches.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(CamelCaseInterceptor)
@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get(':batch_id/ranks')
  getBatchRanks(
    @ValidUser() validUser: User,
    @Param('batch_id', ParseIntPipe) batch_id: number,
  ) {
    const { batch_id: userBatchId } = validUser;

    if (userBatchId !== batch_id) {
      throw new HttpException('접근권한 없음', HttpStatus.UNAUTHORIZED);
    }

    return this.batchesService.getBatchRanks(batch_id); // TODO: 해당 기수의 랭킹 내려주기
  }

  @Get(':batch_id/week/blogs')
  getWeekBlogs(
    @ValidUser() validUser: User,
    @Param('batch_id', ParseIntPipe) batch_id: number,
  ) {
    const { batch_id: userBatchId } = validUser;

    if (userBatchId !== batch_id) {
      throw new HttpException('접근권한 없음', HttpStatus.UNAUTHORIZED);
    }

    return ''; // TODO: 날짜가 인풋으로 들어오면 해당 주의 기수의 사람들이 쓴 글 blogs[] 내려주기, 요일별로 Group By
  }

  @Get(':batch_id/week/users/contribution')
  getUsersContribution(
    @ValidUser() validUser: User,
    @Param('batch_id', ParseIntPipe) batch_id: number,
  ) {
    const { batch_id: userBatchId } = validUser;

    if (userBatchId !== batch_id) {
      throw new HttpException('접근권한 없음', HttpStatus.UNAUTHORIZED);
    }

    return ''; // TODO: 날짜가 인풋으로 들어오면 해당 주의 유저들 블로그 글 카운트해서 페널티 정보 내려주기
  }
}
