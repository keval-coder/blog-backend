import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Blog } from './blog.schema';
import { User } from './user.schema';

export type BlogCommentDocument = HydratedDocument<BlogComment>;

@Schema()
export class BlogComment {
  @Prop({ type: Types.ObjectId, ref: Blog.name })
  blogId: Blog;

  @Prop()
  comment: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: User;

  @Prop({ type: Types.ObjectId, ref: BlogComment.name })
  parentCommentId: BlogComment;
}

export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment);
