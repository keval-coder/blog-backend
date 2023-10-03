import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-guard-startegy/jwt-auth.guard';
import { User } from '../utils/decorators/user.decorator';
import { IUser } from '../utils/interfaces/user.interface';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto) {
    return {
      data: await this.authService.login(loginDto),
      message: 'Login successfully.',
    };
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiBearerAuth()
  async getProfile(@User() user: IUser) {
    console.log(user);

    return {
      data: await this.authService.getProfile(user),
      message: 'Profile fetched successfully.',
    };
  }
}
