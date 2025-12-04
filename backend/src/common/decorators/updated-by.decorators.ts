import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UpdatedBy = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user?.id || "system";
  },
);
