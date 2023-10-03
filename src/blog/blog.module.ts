import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      dest: './upload',
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
