import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
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
