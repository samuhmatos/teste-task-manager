import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/domain/user/services/user.service';
import { PasswordUtil } from '../utils/password.util';
import { SignInDto } from '../dtos';
import { AuthService } from './auth.service';
import { userMock } from 'src/domain/user/__mocks__/user.mock';
import { createUserDtoMock } from 'src/domain/user/__mocks__/create-user.mock';

jest.mock('../utils/password.util');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockSignInDto: SignInDto = {
    email: 'john@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in user successfully with valid credentials', async () => {
      const accessToken = 'mockAccessToken';

      mockUserService.findByEmail.mockResolvedValue(userMock);
      (PasswordUtil.validate as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.signIn(mockSignInDto);

      expect(userService.findByEmail).toHaveBeenCalledWith(
        createUserDtoMock.email,
      );
      expect(PasswordUtil.validate).toHaveBeenCalledWith(
        createUserDtoMock.password,
        userMock.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(result.accessToken).toBe(accessToken);
      expect(result.user.id).toBe(userMock.id);
      expect(result.user.email).toBe(userMock.email);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(service.signIn(mockSignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(mockSignInDto)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(mockSignInDto.email);
      expect(PasswordUtil.validate).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(userMock);
      (PasswordUtil.validate as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(mockSignInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.signIn(mockSignInDto)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(userService.findByEmail).toHaveBeenCalledWith(mockSignInDto.email);
      expect(PasswordUtil.validate).toHaveBeenCalledWith(
        mockSignInDto.password,
        userMock.password,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('should sign up a new user successfully', async () => {
      const accessToken = 'mockAccessToken';
      const newUser = { ...userMock };

      mockUserService.create.mockResolvedValue(newUser);
      mockJwtService.signAsync.mockResolvedValue(accessToken);

      const result = await service.signUp(createUserDtoMock);

      expect(userService.create).toHaveBeenCalledWith(createUserDtoMock);
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(result.accessToken).toBe(accessToken);
      expect(result.user.id).toBe(newUser.id);
      expect(result.user.email).toBe(newUser.email);
      expect(result.user.name).toBe(newUser.name);
      expect(result.user.role).toBe(newUser.role);
    });

    it('should propagate error when user creation fails', async () => {
      const error = new Error('User already exists');
      mockUserService.create.mockRejectedValue(error);

      await expect(service.signUp(createUserDtoMock)).rejects.toThrow(error);

      expect(userService.create).toHaveBeenCalledWith(createUserDtoMock);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
