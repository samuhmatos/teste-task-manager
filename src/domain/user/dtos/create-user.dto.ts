import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BaseEntity } from 'src/shared/types';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto implements BaseEntity<User> {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'admin' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @MinLength(5)
  password: string;
}
