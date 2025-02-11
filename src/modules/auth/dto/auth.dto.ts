import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+$/, {
    message:
      'username must only contain lowercase letters (a-z) and numbers (0-9)',
  })
  username: string;

  @IsNotEmpty()
  @MinLength(12, {
    message: 'password must be at least 12 characters long',
  })
  password: string;
}
