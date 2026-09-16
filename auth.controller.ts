import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

class AuthDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
  @IsString() @MinLength(2) displayName!: string;
}

class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @Post('register') register(@Body() dto: AuthDto) {
    return this.auth.register(dto.email, dto.password, dto.displayName);
  }
  @Post('login') login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }
}
