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

export const regularUserMock: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: UserRole.USER,
  password: 'hashedPassword123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const adminUserMock: User = {
  id: 2,
  name: 'Admin User',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
  password: 'hashedPassword123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const anotherUserMock: User = {
  id: 3,
  name: 'Jane Doe',
  email: 'jane@example.com',
  role: UserRole.USER,
  password: 'hashedPassword123',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};
