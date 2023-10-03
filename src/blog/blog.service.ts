import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../database/schemas/blog.schema';
import { Model, Types } from 'mongoose';
import {
  BlogCommentDto,
  BlogLikeDto,
  CreateBlogDto,
  FindAllBlogDto,
} from './blog.dto';
import { IUser } from '../utils/interfaces/user.interface';
import {
  BlogLike,
  BlogLikeDocument,
} from '../database/schemas/blog-like.schema';
import {
  BlogComment,
  BlogCommentDocument,
} from '../database/schemas/blog-comment.schema';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly BlogModel: Model<BlogDocument>,
    @InjectModel(BlogLike.name)
    private readonly BlogLikeModel: Model<BlogLikeDocument>,
    @InjectModel(BlogComment.name)
    private readonly BlogCommentModel: Model<BlogCommentDocument>,
  ) {}

  async createBlogPost(
    CreateBlogDto: CreateBlogDto,
    file: Express.Multer.File,
  ) {
    const { title, description } = CreateBlogDto;
    console.log(file, '---File');

    try {
      const blog = await this.BlogModel.create({
        title,
        media: file.originalname,
        description,
      });

      return blog;
    } catch (error) {
      throw new BadRequestException('Blog is not created.');
    }
  }

  async findAllBlog(FindAllBlogDto: FindAllBlogDto) {
    const { page, limit, search } = FindAllBlogDto;
    const skip = (page - 1) * limit;
    /***
     *
     * Using aggregation
     */
    // const blogs = await this.BlogModel.aggregate([
    //   {
    //     $match: {
    //       $and: [search ? { title: { $regex: new RegExp(search, 'i') } } : {}],
    //     },
    //   },
    //   {
    //     $skip: skip,
    //   },
    //   {
    //     $limit: limit,
    //   },
    // ]);

    /**
     * Without aggregation
     */
    const blogs = await this.BlogModel.find({
      $and: [search ? { title: search } : {}],
    })
      .skip(skip)
      .limit(limit);

    const blogCount = await this.BlogModel.find({
      $and: [search ? { title: search } : {}],
    }).count();

    return {
      blogs,
      blogCount,
    };
  }

  async blogLikes(BlogLikeDto: BlogLikeDto, user: IUser) {
    const { blogId } = BlogLikeDto;

    const blog = await this.BlogModel.findById(blogId);
    if (!blog) throw new BadRequestException('Blog is not found.');

    const blogLike = await this.BlogLikeModel.findOne({
      blogId: new Types.ObjectId(blogId),
      userId: new Types.ObjectId(user.userId),
    });

    try {
      await this.BlogLikeModel.findOneAndUpdate(
        {
          blogId: new Types.ObjectId(blogId),
          userId: new Types.ObjectId(user.userId),
        },
        {
          like: blogLike ? !blogLike.like : true,
          blogId: new Types.ObjectId(blogId),
          userId: new Types.ObjectId(user.userId),
        },
        {
          upsert: true,
          setDefaultsOnInsert: true,
        },
      ).exec();

      return true;
    } catch (error) {
      throw new BadRequestException('Like is not updated.');
    }
  }

  async blogComment(BlogCommentDto: BlogCommentDto, user: IUser) {
    const { blogId, comment, parentCommentId } = BlogCommentDto;

    const blog = await this.BlogModel.findById(blogId);
    if (!blog) throw new BadRequestException('Blog is not found.');

    let parentComment: BlogCommentDocument;
    if (parentCommentId) {
      parentComment = await this.BlogCommentModel.findById(parentCommentId);
    }

    try {
      const blogComment = await this.BlogCommentModel.create({
        blogId: new Types.ObjectId(blogId),
        comment,
        userId: new Types.ObjectId(user.userId),
        parentCommentId: parentComment ? parentComment._id : null,
      });

      return blogComment;
    } catch (error) {
      throw new BadRequestException('Comment is not added.');
    }
  }
}
