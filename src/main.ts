import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Укажите источник вашего фронтенда
    credentials: true, // Разрешить отправку cookies/credentials
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    allowedHeaders: 'Content-Type, Accept, Authorization', //
  });
  const config = new DocumentBuilder()
    .setTitle('Working World')
    .setDescription(
      'This documentation is created for Frontend Developer, that can deal with backend using this document ',
    )
    .setVersion('1.0')
    .addTag('Working World')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'JWT',
    )
    .build();

  const documetnFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documetnFactory);
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
