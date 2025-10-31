import { Task } from '../entities/task.entity';
import { userMock } from 'src/domain/user/__mocks__/user.mock';

export const taskMock: Task = {
  id: 1,
  title: 'Complete the project',
  description: 'Finish all pending tasks',
  completed: false,
  userId: 1,
  user: userMock,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};
