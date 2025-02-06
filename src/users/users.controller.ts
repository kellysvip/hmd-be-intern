import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserBody, updateUserBody } from './users.request-schema';

@Controller('users')
@ApiTags('USERS')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody(createUserBody)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  getListOfUsers() {
    return this.usersService.getListOfUsers();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    example: '1',
  })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    example: '1',
  })
  @ApiBody(updateUserBody)
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    example: '1',
  })
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(+id);
  }
}
