import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete the project' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Finish all pending tasks', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: false, required: false, default: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
