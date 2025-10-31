import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/domain/user/services/user.service';
import { UserRole } from 'src/domain/user/enums/user-role.enum';
import { LoginPayloadDto } from '../dtos';
import { JwtStrategy } from './jwt.strategy';
import { userMock } from 'src/domain/user/__mocks__/user.mock';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userService: UserService;

  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user when found by id', async () => {
      const loginPayload: LoginPayloadDto = {
        id: 1,
        role: UserRole.USER,
      };

      mockUserService.findById.mockResolvedValue(userMock);

      const result = await strategy.validate(loginPayload);

      expect(userService.findById).toHaveBeenCalledWith(loginPayload.id);
      expect(result).toEqual(userMock);
    });

    it('should return null when user is not found', async () => {
      const loginPayload: LoginPayloadDto = {
        id: 999,
        role: UserRole.USER,
      };

      mockUserService.findById.mockResolvedValue(null);

      const result = await strategy.validate(loginPayload);

      expect(userService.findById).toHaveBeenCalledWith(loginPayload.id);
      expect(result).toBeNull();
    });

    it('should call userService with correct payload id', async () => {
      const loginPayload: LoginPayloadDto = {
        id: 123,
        role: UserRole.ADMIN,
      };

      mockUserService.findById.mockResolvedValue(userMock);

      await strategy.validate(loginPayload);

      expect(userService.findById).toHaveBeenCalledWith(123);
      expect(userService.findById).toHaveBeenCalledTimes(1);
    });
  });
});
