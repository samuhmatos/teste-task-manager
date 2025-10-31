import { ApiProperty } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class ReturnTaskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.completed = task.completed;
    this.userId = task.userId;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
  }
}
