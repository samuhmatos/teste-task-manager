import { User } from 'src/domain/user/entities/user.entity';
import { UserRole } from 'src/domain/user/enums/user-role.enum';

export class LoginPayloadDto {
  id: number;
  role: UserRole;

  constructor(user: User) {
    this.id = user.id;
    this.role = user.role;

    return Object.assign({}, this);
  }
}
