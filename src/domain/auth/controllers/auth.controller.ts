import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { SignInDto, SignUpDto } from '../dtos';
import { ReturnAuthDto } from '../dtos';
import { Controller, Get, Post, Req } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Auth } from '../decorators/jwt-auth.decorator';
import { ReturnUserDto } from 'src/domain/user/dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 201,
    description: 'User signed in successfully',
    type: ReturnAuthDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signIn(@Body() signInDto: SignInDto): Promise<ReturnAuthDto> {
    return await this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Sign up a user' })
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    description: 'User signed up successfully',
    type: ReturnAuthDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async signUp(@Body() signUpDto: SignUpDto): Promise<ReturnAuthDto> {
    return await this.authService.signUp(signUpDto);
  }

  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user',
    type: ReturnUserDto,
  })
  @Get('me')
  me(@Req() req: Request): ReturnUserDto {
    return new ReturnUserDto(req.user);
  }
}
