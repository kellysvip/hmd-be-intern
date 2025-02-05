import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /*
   * Create a new user
   *
   * createUserDto  -  user details
   *
   * Return a new user has been created
   */
  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: createUserDto });
    return user;
  }

  /*
   * Get all users
   *
   * Return a list of users
   */
  getListOfUsers() {
    return this.prisma.user.findMany();
  }

  /*
   * Get all details of users
   *
   * id  -  id of user
   *
   * Return a details of users
   */
  getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  /*
   * Update user information
   *
   * id             -  id of user
   * updateUserDto  -  update details
   *
   * Return an updated user
   */
  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  /*
   * Delete a user in db
   *
   * id  -  id of user
   *
   * a user has been deleted
   */
  removeUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
