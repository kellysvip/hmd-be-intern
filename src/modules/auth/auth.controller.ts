import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  HttpException,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { loginBodySchema } from './auth.request-schema';
import validationPipe from '../../validation-pipe';
import { SwaggerTags } from '../../common/constants/enums/swagger-tags.enum';

@Controller('auth')
@ApiTags(SwaggerTags.AUTH)
@UsePipes(validationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody(loginBodySchema)
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Body() dto: AuthDto) {
    const deviceId = req.headers['deviceid'];

    return this.authService.login(deviceId, dto);
  }
}
