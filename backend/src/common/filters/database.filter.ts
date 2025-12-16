import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();


    if (exception.code === '23505') {

      return response.status(400).json({
        message: 'Email already exists',
      });
    }

    response.status(500).json({
      message: exception.message || 'Database error',
    });
  }
}
