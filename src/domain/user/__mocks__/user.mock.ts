import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export const userMock: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: UserRole.USER,
  password: 'hashedPassword123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};
