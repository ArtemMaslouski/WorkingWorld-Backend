import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    cors({
      credentials: true,
      origin: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Working World')
    .setDescription(
      'This documentation is created for Frontend Developer, that can deal with backend using this document ',
    )
    .setVersion('1.0')
    .addTag('Working World')
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
