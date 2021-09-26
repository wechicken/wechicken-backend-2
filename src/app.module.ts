import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { BatchesModule } from './batches/batches.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { LikesModule } from './likes/likes.module';
import { TagsModule } from './tags/tags.module';
import { getConnectionOptions } from 'typeorm';
import { AuthMoudle } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    AuthMoudle,
    BlogsModule,
    BatchesModule,
    BookmarksModule,
    LikesModule,
    TagsModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => Object.assign(await getConnectionOptions()),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
