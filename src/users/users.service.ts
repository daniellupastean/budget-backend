import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async getById(id: string) {
    return await this.usersRepository.findOneBy({ id });
  }

  async createUser(user: User) {
    return await this.usersRepository.save(user);
  }

  async updateUser(id: string, userData: any) {
    return await this.usersRepository.update(id, userData);
  }
}
