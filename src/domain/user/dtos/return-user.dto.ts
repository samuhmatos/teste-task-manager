import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export class ReturnUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.role = user.role;
    this.email = user.email;
    this.name = user.name;
  }
}
