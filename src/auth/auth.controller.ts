import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
    );
    return { message: 'Usuario creado exitosamente', user };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    const data = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return { message: 'Inicio de sesión exitoso', ...data };
  }
}
