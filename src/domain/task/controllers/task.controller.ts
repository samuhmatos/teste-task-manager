import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { Auth } from 'src/domain/auth/decorators/auth.decorator';
import { CreateTaskDto, UpdateTaskDto, ReturnTaskDto } from '../dtos';
import { TaskService } from '../services/task.service';

@ApiTags('Tasks')
@Controller('tasks')
@Auth()
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: ReturnTaskDto,
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: Request,
  ): Promise<ReturnTaskDto> {
    const task = await this.taskService.create(createTaskDto, req.user);
    return new ReturnTaskDto(task);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tasks',
    description:
      'Regular users can only see their own tasks. Admins can see all tasks.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tasks',
    type: [ReturnTaskDto],
  })
  async findAll(@Req() req: Request): Promise<ReturnTaskDto[]> {
    const tasks = await this.taskService.findAll(req.user);
    return tasks.map((task) => new ReturnTaskDto(task));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({
    status: 200,
    description: 'Task found',
    type: ReturnTaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to access this task',
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<ReturnTaskDto> {
    const task = await this.taskService.findOne(id, req.user);
    return new ReturnTaskDto(task);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: ReturnTaskDto,
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to update this task',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ): Promise<ReturnTaskDto> {
    const task = await this.taskService.update(id, updateTaskDto, req.user);
    return new ReturnTaskDto(task);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({
    status: 204,
    description: 'Task deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({
    description: 'You do not have permission to delete this task',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<void> {
    await this.taskService.remove(id, req.user);
  }
}
