import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async createUser(CreateUserDto: CreateUserDto) {
    const { name, email, role } = CreateUserDto;

    const soltOrRounds = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('B4c0/\\/', soltOrRounds);

    try {
      const user = await this.UserModel.create({
        name,
        email,
        password: hash,
        role,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return user;
    } catch (error) {
      throw new BadRequestException('User is not created.');
    }
  }
}
