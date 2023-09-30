import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { USER_OR_PASS_INVALID } from './exceptions/errors.const';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async login(name: string, password: string): Promise<string> {
    const user = await this.usersService.findUser(name);

    if (!user) {
      throw new UnauthorizedException(USER_OR_PASS_INVALID);
    }

    const isCorrectPass = await compare(password, user.passwordHash);
    if (!isCorrectPass) {
      throw new UnauthorizedException(USER_OR_PASS_INVALID);
    }

    const tokenPayload = { name };
    return await this.jwtService.signAsync(tokenPayload);
  }
}
