import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { UnauthorizedFilter } from './common/filters/unautherized.filter';
import { DatabaseExceptionFilter } from './common/filters/database.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,   
  });

   // 🔹 Swagger config
  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
    new ResponseInterceptor(),
  );

  await app.listen(3000);
}

bootstrap();
