import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import {
  BlogCommentDto,
  BlogLikeDto,
  CreateBlogDto,
  FindAllBlogDto,
} from './blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-guard-startegy/jwt-auth.guard';
import { User } from '../utils/decorators/user.decorator';
import { IUser } from '../utils/interfaces/user.interface';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../utils/decorators/roles.decorator';
import { RolesGuard } from '../utils/guards/roles.guard';
import { diskStorage } from 'multer';

@ApiTags('Blogs')
@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/create')
  @Roles('Admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = file.originalname;
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        media: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  async createBlog(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      data: await this.blogService.createBlogPost(createBlogDto, file),
      message: 'Blog created successfully.',
    };
  }

  @Get('/findAll')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  async findAllBlogs(@Query() findAllBlogDto: FindAllBlogDto) {
    return {
      data: await this.blogService.findAllBlog(findAllBlogDto),
      message: 'Blogs fetched successfully.',
    };
  }

  @Post('/like')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  async blogLike(@Body() blogLikeDto: BlogLikeDto, @User() user: IUser) {
    return {
      data: await this.blogService.blogLikes(blogLikeDto, user),
      message: 'Like updated successfully.',
    };
  }

  @Post('/comment')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  async blogComment(
    @Body() blogCommentDto: BlogCommentDto,
    @User() user: IUser,
  ) {
    return {
      data: await this.blogService.blogComment(blogCommentDto, user),
      message: 'Comment updated successfully.',
    };
  }
}
