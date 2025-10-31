import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/domain/user/entities/user.entity';
import { UserRole } from 'src/domain/user/enums/user-role.enum';
import { Repository } from 'typeorm';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      userId: user.id,
      user,
    });
    return this.taskRepository.save(task);
  }

  async findAll(user: User): Promise<Task[]> {
    if (user.role === UserRole.ADMIN) {
      return this.taskRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });
    }
    return this.taskRepository.find({
      where: { userId: user.id },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task || !this.validateTaskOwnership(task, user)) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);

    if (!task || !this.validateTaskOwnership(task, user)) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepository.save(task);
  }

  async remove(id: number, user: User): Promise<void> {
    const task = await this.findOne(id, user);

    if (!task || !this.validateTaskOwnership(task, user)) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.remove(task);
  }

  private validateTaskOwnership(task: Task, user: User): boolean {
    if (user.role !== UserRole.ADMIN && task.userId !== user.id) {
      return false;
    }
    return true;
  }
}
