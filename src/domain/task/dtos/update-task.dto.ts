import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional, IsBoolean } from 'class-validator';
import { BaseUpdateEntity } from 'src/shared/types';
import { Task } from '../entities/task.entity';

export class UpdateTaskDto implements BaseUpdateEntity<Task> {
  @ApiProperty({ example: 'Complete the project', required: false })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Finish all pending tasks', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
