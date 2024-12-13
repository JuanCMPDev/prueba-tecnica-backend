import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private SALT_ROUNDS = 10;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('El usuario ya existe.');
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);
    const newUser = await this.userService.createUser(email, hashedPassword);

    return {
      id: newUser._id,
      email: newUser.email,
    };
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const payload = { userId: user._id.toHexString(), email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    };
  }
}
