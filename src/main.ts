import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'


async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: {
    origin: 'http://localhost:3000'
  }});
  const config = new DocumentBuilder()
    .setTitle('Working World')
    .setDescription('This documentation is created for Frontend Developer, that can deal with backend using this document ')
    .setVersion('1.0')
    .addTag('Working World')
    .build();

    const documetnFactory = () => SwaggerModule.createDocument(app,config);
    SwaggerModule.setup('api',app,documetnFactory)
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();