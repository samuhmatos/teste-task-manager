import { ApiProperty } from '@nestjs/swagger';
import { ReturnUserDto } from 'src/domain/user/dtos';
import { User } from 'src/domain/user/entities/user.entity';

export class ReturnAuthDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: ReturnUserDto;

  constructor(accessToken: string, user: User) {
    this.accessToken = accessToken;
    this.user = new ReturnUserDto(user);
  }
}
