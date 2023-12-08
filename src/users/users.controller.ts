import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  Param,
  Redirect,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Post('create-user')
  @Redirect('/users/view', 302)
  async createUser(@Body() user: User) {
    return await this.usersService.createUser(user);
  }

  @Get('view')
  @Render('users/index.view.hbs')
  async getUsersView() {
    const users = await this.usersService.getAllUsers();
    const usersForUI = users.map((user) => {
      return {
        id: user.id,
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
      };
    });
    return { users: usersForUI };
  }

  @Get('create')
  @Render('users/create.view.hbs')
  createUserView() {
    return { message: 'Create user' };
  }

  @Get('edit-user/:id')
  @Render('users/edit.view.hbs')
  async editUser(@Param('id') id: string) {
    const user = await this.usersService.getById(id);
    return { user };
  }

  @Post('update-user/:id')
  @Redirect('/users/view', 302)
  async updateUser(@Param('id') id: string, @Body() userData: any) {
    await this.usersService.updateUser(id, userData);
    return { redirect: '/users/view' };
  }
}
