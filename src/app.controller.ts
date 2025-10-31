import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @ApiOperation({ summary: 'Get health check' })
  @ApiResponse({
    status: 200,
    description: 'Health check',
  })
  @Get()
  getHealth(): string {
    return 'OK';
  }
}
