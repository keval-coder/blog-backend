import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Blog } from './blog.schema';
import { User } from './user.schema';

export type BlogLikeDocument = HydratedDocument<BlogLike>;

@Schema()
export class BlogLike {
  @Prop({ type: Types.ObjectId, ref: Blog.name })
  blogId: Blog;

  @Prop()
  like: boolean;

  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: User;
}

export const BlogLikeSchema = SchemaFactory.createForClass(BlogLike);
