import { CreateUserDto } from '../dtos';
import { UserRole } from '../enums/user-role.enum';

export const createUserDtoMock: CreateUserDto = {
  name: 'John Doe',
  email: 'john@example.com',
  role: UserRole.USER,
  password: 'password123',
};
