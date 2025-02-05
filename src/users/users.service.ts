import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  createUser(createUserDto: CreateUserDto) {
    this.prisma.user.create({ data: createUserDto });

    return `User ${createUserDto.name} has been created`
  }

  getListOfUsers() {
    return this.prisma.user.findMany();
  }

  getUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data: updateUserDto });
  }

  removeUser(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
