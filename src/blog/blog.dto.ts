import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class FindAllBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform((page) => Number(page), { toClassOnly: true })
  page: number;

  @ApiProperty()
  @IsNotEmpty()
  @Transform((page) => Number(page), { toClassOnly: true })
  limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search: string;
}

export class BlogLikeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  blogId: string;
}

export class BlogCommentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  blogId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  comment: string;

  @ApiPropertyOptional()
  @IsOptional()
  parentCommentId: string;
}
