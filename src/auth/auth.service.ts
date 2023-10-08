import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../database/schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../utils/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(LoginDto: LoginDto) {
    const { email } = LoginDto;
    const userExist = await this.validateUser(email);

    const payload = {
      userId: userExist._id,
      email: userExist.email,
      role: userExist.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(email: string) {
    const user = await this.UserModel.findOne({ email });
    if (!user) throw new BadRequestException('Email is not valid.');

    const isMatch = bcrypt.compareSync('B4c0/\\/', user.password);
    if (!isMatch) throw new BadRequestException('Password is not valid.');

    return {
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id,
    };
  }

  async getProfile(user: IUser) {
    const { userId } = user;

    const userProfile = await this.UserModel.findById(userId, {
      name: 1,
      email: 1,
      role: 1,
    });
    if (!userProfile) throw new BadRequestException('User is not found.');

    return userProfile;
  }
}
