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

const database = MongooseModule.forRoot(
  'mongodb+srv://keval-admin:12345@mycluster.hhcms3y.mongodb.net/enthusia_blog_db',
);

@Module({
  imports: [database, repos],
  exports: [repos],
})
export class DatabaseModule {}
