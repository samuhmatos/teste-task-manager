import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/domain/user/entities/user.entity';
import { UserService } from 'src/domain/user/services/user.service';
import { LoginPayloadDto, ReturnAuthDto, SignInDto, SignUpDto } from '../dtos';
import { PasswordUtil } from '../utils/password.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<ReturnAuthDto> {
    const user = await this.userService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await PasswordUtil.validate(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = await this.createToken(user);
    return new ReturnAuthDto(accessToken, user);
  }

  async signUp(signUpDto: SignUpDto): Promise<ReturnAuthDto> {
    const user = await this.userService.create(signUpDto);
    const accessToken = await this.createToken(user);
    return new ReturnAuthDto(accessToken, user);
  }

  private async createToken(user: User): Promise<string> {
    const payload = new LoginPayloadDto(user);
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
}
