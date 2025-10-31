import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordUtil } from 'src/domain/auth/utils/password.util';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existUser = await this.findByEmail(createUserDto.email);
    if (existUser) {
      throw new BadRequestException('User already exists');
    }
    const passwordHash = await PasswordUtil.createHash(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: passwordHash,
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async find(): Promise<User[]> {
    return this.userRepository.find();
  }
}
