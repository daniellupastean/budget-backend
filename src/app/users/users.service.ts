import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Logger } from 'winston';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @Inject('WINSTON_LOGGER')
    private logger: Logger,
  ) {}

  async getAllUsers() {
    this.logger.info('Fetching all users');
    try {
      const users = await this.usersRepository.find();
      this.logger.info(`Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error(`Error fetching all users: ${error.message}`);
      throw error;
    }
  }

  async getByEmail(email: string) {
    this.logger.info(`Fetching user by email: ${email}`);
    try {
      const user = await this.usersRepository.findOneBy({ email });
      if (user) {
        this.logger.info(`User found with email: ${email}`);
      } else {
        this.logger.warn(`No user found with email: ${email}`);
      }
      return user;
    } catch (error) {
      this.logger.error(
        `Error fetching user by email ${email}: ${error.message}`,
      );
      throw error;
    }
  }

  async getById(id: string) {
    this.logger.info(`Fetching user by ID: ${id}`);
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (user) {
        this.logger.info(`User found with ID: ${id}`);
      } else {
        this.logger.warn(`No user found with ID: ${id}`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user by ID ${id}: ${error.message}`);
      throw error;
    }
  }

  async createUser(user: User) {
    this.logger.info(`Creating new user`);
    try {
      const newUser = await this.usersRepository.save(user);
      this.logger.info(`User created with ID: ${newUser.id}`);
      return newUser;
    } catch (error) {
      this.logger.error(`Error creating new user: ${error.message}`);
      throw error;
    }
  }

  async updateUser(id: string, userData: any) {
    this.logger.info(`Updating user with ID: ${id}`);
    try {
      const updateResult = await this.usersRepository.update(id, userData);
      if (updateResult.affected > 0) {
        this.logger.info(`User updated with ID: ${id}`);
      } else {
        this.logger.warn(`No user found with ID: ${id} to update`);
      }
      return updateResult;
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id}: ${error.message}`);
      throw error;
    }
  }
}
