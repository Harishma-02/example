import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { UnauthorizedFilter } from './common/filters/unautherized.filter';
import { DatabaseExceptionFilter } from './common/filters/database.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,   
  });


  app.use(
    bodyParser.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf; 
      },
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new UnauthorizedFilter(),
    new DatabaseExceptionFilter(),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(),
  );

  await app.listen(3000);
}

bootstrap();
