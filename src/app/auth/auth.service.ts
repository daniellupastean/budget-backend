import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './auth.dtos';
import { User } from '../users/user.entity';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @Inject('WINSTON_LOGGER')
    private logger: Logger,
  ) {}

  async login(data: LoginDto) {
    this.logger.info(`Attempting login for email: ${data.email}`);
    try {
      const user = await this.usersService.getByEmail(data.email);
      if (!user) {
        this.logger.warn(
          `Login failed - no user found with email: ${data.email}`,
        );
        throw new UnauthorizedException('Invalid credentials!');
      }

      if (!(await bcrypt.compare(data.password, user.password))) {
        this.logger.warn(
          `Login failed - invalid password for email: "${data.email}"`,
        );
        throw new UnauthorizedException('Invalid credentials!');
      }

      const jwt = await this.jwtService.signAsync({
        user: {
          id: user.id,
          role: user.role,
        },
      });

      this.logger.info(`Login successful for email: ${data.email}`);
      return { accessToken: jwt };
    } catch (error) {
      this.logger.error(
        `Login error for email ${data.email}: ${error.message}`,
      );
      throw error;
    }
  }

  async register(data: RegisterDto) {
    this.logger.info(`Attempting to register user with email: ${data.email}`);
    try {
      const existingUser = await this.usersService.getByEmail(data.email);
      if (existingUser && !('message' in existingUser)) {
        this.logger.warn(
          `Registration failed - email already in use: ${data.email}`,
        );
        throw new BadRequestException('Email already used');
      }

      const newUser = new User();
      newUser.email = data.email;
      newUser.password = data.password;
      newUser.firstName = data.firstName;
      newUser.lastName = data.lastName;

      const user = await this.usersService.createUser(newUser);
      if (!user) {
        this.logger.error(
          `Registration failed - unable to create user with email: ${data.email}`,
        );
        throw new BadRequestException('Something went wrong');
      }

      const jwt = await this.jwtService.signAsync({
        user: {
          id: user.id,
          role: user.role,
        },
      });

      this.logger.info(`Registration successful for email: ${data.email}`);
      return { message: 'Account successfully created', accessToken: jwt };
    } catch (error) {
      this.logger.error(
        `Registration error for email ${data.email}: ${error.message}`,
      );
      throw error;
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersService.getById(userId);
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.role;

    return user;
  }
}
