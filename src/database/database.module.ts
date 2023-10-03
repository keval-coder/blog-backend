import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogLike, BlogLikeSchema } from './schemas/blog-like.schema';
import { BlogComment, BlogCommentSchema } from './schemas/blog-comment.schema';

const repos = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Blog.name, schema: BlogSchema },
  { name: BlogLike.name, schema: BlogLikeSchema },
  { name: BlogComment.name, schema: BlogCommentSchema },
]);

const database = MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: 'mongodb://localhost:27017/enthusia_blog_db', // please add your database string here
  }),
});

@Module({
  imports: [database, repos],
  exports: [repos],
})
export class DatabaseModule {}
