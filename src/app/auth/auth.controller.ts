import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './auth.dtos';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { AuthUser } from './decorators/auth-user.decorator';
import { User } from '../users/user.entity';
import { JwtAuthGuard } from './guards/jwt.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data); // return JWT access token
  }

  @Post('register')
  async register(@Body() data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const serializedData = {
      ...data,
      password: hashedPassword,
    };
    return this.authService.register(serializedData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@AuthUser() user: User) {
    return await this.authService.getCurrentUser(user.id);
  }
}
