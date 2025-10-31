import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  regularUserMock,
  adminUserMock,
  anotherUserMock,
} from 'src/domain/user/__mocks__/user.mock';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { Task } from '../entities/task.entity';
import { TaskService } from './task.service';
import { taskMock } from '../__mocks__/task.mock';
import { createTaskDtoMock } from '../__mocks__/create-task.mock';

describe('TaskService', () => {
  let service: TaskService;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      const expectedTask = {
        ...taskMock,
        ...createTaskDtoMock,
        userId: regularUserMock.id,
        user: regularUserMock,
      };

      mockTaskRepository.create.mockReturnValue(expectedTask);
      mockTaskRepository.save.mockResolvedValue(expectedTask);

      const result = await service.create(createTaskDtoMock, regularUserMock);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        ...createTaskDtoMock,
        userId: regularUserMock.id,
        user: regularUserMock,
      });
      expect(mockTaskRepository.save).toHaveBeenCalledWith(expectedTask);
      expect(result).toEqual(expectedTask);
    });

    it('should create task with minimal data', async () => {
      const minimalDto: CreateTaskDto = {
        title: 'Simple task',
      };
      const expectedTask = {
        ...taskMock,
        title: 'Simple task',
        description: undefined,
        completed: undefined,
        userId: regularUserMock.id,
        user: regularUserMock,
      };

      mockTaskRepository.create.mockReturnValue(expectedTask);
      mockTaskRepository.save.mockResolvedValue(expectedTask);

      const result = await service.create(minimalDto, regularUserMock);

      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: 'Simple task',
        userId: regularUserMock.id,
        user: regularUserMock,
      });
      expect(result).toEqual(expectedTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks for admin user', async () => {
      const mockTasks: Task[] = [
        taskMock,
        {
          ...taskMock,
          id: 2,
          title: 'Another task',
          userId: 2,
        },
      ];

      mockTaskRepository.find.mockResolvedValue(mockTasks);

      const result = await service.findAll(adminUserMock);

      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(mockTasks);
    });

    it('should return only user tasks for regular user', async () => {
      const userTasks: Task[] = [taskMock];

      mockTaskRepository.find.mockResolvedValue(userTasks);

      const result = await service.findAll(regularUserMock);

      expect(mockTaskRepository.find).toHaveBeenCalledWith({
        where: { userId: regularUserMock.id },
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual(userTasks);
    });

    it('should return empty array when no tasks exist', async () => {
      mockTaskRepository.find.mockResolvedValue([]);

      const result = await service.findAll(regularUserMock);

      expect(mockTaskRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return task when found and user is owner', async () => {
      mockTaskRepository.findOne.mockResolvedValue(taskMock);

      const result = await service.findOne(taskMock.id, regularUserMock);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskMock.id },
        relations: ['user'],
      });
      expect(result).toEqual(taskMock);
    });

    it('should return task when found and user is admin', async () => {
      const otherUserTask: Task = {
        ...taskMock,
        userId: anotherUserMock.id,
      };

      mockTaskRepository.findOne.mockResolvedValue(otherUserTask);

      const result = await service.findOne(otherUserTask.id, adminUserMock);

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: otherUserTask.id },
        relations: ['user'],
      });
      expect(result).toEqual(otherUserTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999, regularUserMock)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(999, regularUserMock)).rejects.toThrow(
        'Task not found',
      );

      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException when task belongs to another user (not admin)', async () => {
      const otherUserTask: Task = {
        ...taskMock,
        userId: anotherUserMock.id,
      };

      mockTaskRepository.findOne.mockResolvedValue(otherUserTask);

      await expect(
        service.findOne(otherUserTask.id, regularUserMock),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findOne(otherUserTask.id, regularUserMock),
      ).rejects.toThrow('Task not found');
    });
  });

  describe('update', () => {
    it('should update task successfully when user is owner', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Updated title',
        completed: true,
      };
      const updatedTask = {
        ...taskMock,
        ...updateDto,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(taskMock);
      mockTaskRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(
        taskMock.id,
        updateDto,
        regularUserMock,
      );

      expect(service.findOne as jest.Mock).toHaveBeenCalledWith(
        taskMock.id,
        regularUserMock,
      );
      expect(mockTaskRepository.save).toHaveBeenCalledWith({
        ...taskMock,
        ...updateDto,
      });
      expect(result).toEqual(updatedTask);
    });

    it('should update task successfully when user is admin', async () => {
      const updateDto: UpdateTaskDto = {
        description: 'Updated description',
      };
      const updatedTask = {
        ...taskMock,
        ...updateDto,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(taskMock);
      mockTaskRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(
        taskMock.id,
        updateDto,
        adminUserMock,
      );

      expect(service.findOne as jest.Mock).toHaveBeenCalledWith(
        taskMock.id,
        adminUserMock,
      );
      expect(mockTaskRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const updateDto: UpdateTaskDto = {
        title: 'Updated title',
      };

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Task not found'));

      await expect(
        service.update(999, updateDto, regularUserMock),
      ).rejects.toThrow(NotFoundException);

      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not owner and not admin', async () => {
      const otherUserTask: Task = {
        ...taskMock,
        userId: anotherUserMock.id,
      };
      const updateDto: UpdateTaskDto = {
        title: 'Updated title',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(otherUserTask);

      await expect(
        service.update(otherUserTask.id, updateDto, regularUserMock),
      ).rejects.toThrow(NotFoundException);

      expect(mockTaskRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove task successfully when user is owner', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(taskMock);
      mockTaskRepository.remove.mockResolvedValue(taskMock);

      await service.remove(taskMock.id, regularUserMock);

      expect(service.findOne as jest.Mock).toHaveBeenCalledWith(
        taskMock.id,
        regularUserMock,
      );
      expect(mockTaskRepository.remove).toHaveBeenCalledWith(taskMock);
    });

    it('should remove task successfully when user is admin', async () => {
      const otherUserTask: Task = {
        ...taskMock,
        userId: anotherUserMock.id,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(otherUserTask);
      mockTaskRepository.remove.mockResolvedValue(otherUserTask);

      await service.remove(otherUserTask.id, adminUserMock);

      expect(service.findOne as jest.Mock).toHaveBeenCalledWith(
        otherUserTask.id,
        adminUserMock,
      );
      expect(mockTaskRepository.remove).toHaveBeenCalledWith(otherUserTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Task not found'));

      await expect(service.remove(999, regularUserMock)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockTaskRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when user is not owner and not admin', async () => {
      const otherUserTask: Task = {
        ...taskMock,
        userId: anotherUserMock.id,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(otherUserTask);

      await expect(
        service.remove(otherUserTask.id, regularUserMock),
      ).rejects.toThrow(NotFoundException);

      expect(mockTaskRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('validateTaskOwnership', () => {
    it('should return true when user is admin', () => {
      const result = (service as any).validateTaskOwnership(
        taskMock,
        adminUserMock,
      );

      expect(result).toBe(true);
    });

    it('should return true when user is owner', () => {
      const result = (service as any).validateTaskOwnership(
        taskMock,
        regularUserMock,
      );

      expect(result).toBe(true);
    });

    it('should return false when user is not owner and not admin', () => {
      const otherUserTask: Task = {
        ...taskMock,
        userId: anotherUserMock.id,
      };

      const result = (service as any).validateTaskOwnership(
        otherUserTask,
        regularUserMock,
      );

      expect(result).toBe(false);
    });
  });
});
