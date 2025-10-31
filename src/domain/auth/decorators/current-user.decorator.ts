import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { LoginPayloadDto } from '../dtos';

export const CurrentUser = createParamDecorator(
  (data: keyof LoginPayloadDto, ctx: ExecutionContext) => {
    const request: any = ctx.switchToHttp().getRequest();
    return data ? request.user[data] : request.user;
  },
);
