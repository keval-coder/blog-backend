import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
  ) {}

  async createUser(CreateUserDto: CreateUserDto) {
    const { name, email, password, role } = CreateUserDto;

    const soltOrRounds = 10;
    const hash = await bcrypt.hash(password, soltOrRounds);

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
