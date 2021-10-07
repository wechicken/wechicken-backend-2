import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ValidUser } from 'src/auth/decorator/ValidUser';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CamelCaseInterceptor } from 'src/interceptors/CamelCaseInterceptor';
import { User } from 'src/users/user.entity';
import { BatchesService } from './batches.service';
import { BatchSearchInput } from './dto/input/batch-search.input';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@UseInterceptors(CamelCaseInterceptor)
@Controller('batches')
@ApiTags('기수 API')
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

    return this.batchesService.getBatchRanks(batch_id);
  }

  @Get(':batch_id/week/users/contribution')
  getUsersContribution(
    @ValidUser() validUser: User,
    @Param('batch_id', ParseIntPipe) batch_id: number,
    @Query() { selected_date }: BatchSearchInput,
  ) {
    const { batch_id: userBatchId } = validUser;

    if (userBatchId !== batch_id) {
      throw new HttpException('접근권한 없음', HttpStatus.UNAUTHORIZED);
    }

    return this.batchesService.getUsersContributionByWeek(
      batch_id,
      selected_date,
    );
  }

  @Get(':batch_id/week/blogs')
  getWeekBlogs(
    @ValidUser() validUser: User,
    @Param('batch_id', ParseIntPipe) batch_id: number,
    @Query() { selected_date }: BatchSearchInput,
  ) {
    const { batch_id: userBatchId } = validUser;

    if (userBatchId !== batch_id) {
      throw new HttpException('접근권한 없음', HttpStatus.UNAUTHORIZED);
    }

    return this.batchesService.getBlogsOfWeek(batch_id, selected_date);
  }
}
