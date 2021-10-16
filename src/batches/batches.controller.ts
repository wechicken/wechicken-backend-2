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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  BatchRankResponse,
  UsersContributionResponse,
  WeekBlogsResponse,
} from './dto/response/batch.reponse';

@UseGuards(JwtAuthGuard)
@UseInterceptors(CamelCaseInterceptor)
@ApiTags('기수 API')
@ApiBearerAuth('authorization')
@Controller('batches')
export class BatchesController {
  constructor(private readonly batchesService: BatchesService) {}

  @Get(':batch_id/ranks')
  @ApiOperation({
    summary: '기수별 랭킹 조회 API',
    description: '기수별 블로그 작성 순위 상위 3명 조회',
  })
  @ApiOkResponse({ type: [BatchRankResponse] })
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
  @ApiOperation({
    summary: '해당 주의 블로그 수 및 패널티 조회 API',
    description: '날짜 입력 시 해당 주의 블로그 수, 패널티 정보 조회',
  })
  @ApiParam({
    name: 'batch_id',
    description: '기수 ID',
  })
  @ApiOkResponse({ type: [UsersContributionResponse] })
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
  @ApiOperation({
    summary: '해당 주의 유저 블로그 요일별 그룹핑 조회 API',
    description: '날짜 입력 시 해당 주의 유저 블로그 요일별 그룹핑 조회',
  })
  @ApiParam({
    name: 'batch_id',
    description: '기수 ID',
  })
  @ApiOkResponse({ type: WeekBlogsResponse })
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
