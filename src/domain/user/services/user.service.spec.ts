import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PasswordUtil } from 'src/domain/auth/utils/password.util';
import { CreateUserDto } from '../dtos';
import { UserRole } from '../enums/user-role.enum';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { userMock } from '../__mocks__/user.mock';
import { createUserDtoMock } from '../__mocks__/create-user.mock';

jest.mock('src/domain/auth/utils/password.util');

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const expectedUser = { ...userMock, password: hashedPassword };

      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      (PasswordUtil.createHash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockReturnValue(expectedUser);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createUserDtoMock);

      expect(service.findByEmail).toHaveBeenCalledWith(createUserDtoMock.email);
      expect(PasswordUtil.createHash).toHaveBeenCalledWith(
        createUserDtoMock.password,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDtoMock,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });

    it('should throw BadRequestException when user already exists', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(userMock);

      await expect(service.create(createUserDtoMock)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createUserDtoMock)).rejects.toThrow(
        'User already exists',
      );

      expect(service.findByEmail).toHaveBeenCalledWith(createUserDtoMock.email);
      expect(PasswordUtil.createHash).not.toHaveBeenCalled();
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(userMock);

      const result = await service.findByEmail('john@example.com');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(userMock);
    });

    it('should return null when user is not found by email', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user when found by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(userMock);

      const result = await service.findById(1);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(userMock);
    });

    it('should return null when user is not found by id', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        userMock,
        {
          ...userMock,
          id: 2,
          email: 'jane@example.com',
          name: 'Jane Doe',
        },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.find();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array when no users exist', async () => {
      mockUserRepository.find.mockResolvedValue([]);

      const result = await service.find();

      expect(mockUserRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
