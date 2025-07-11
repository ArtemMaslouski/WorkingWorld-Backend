import { DocumentBuilder } from '@nestjs/swagger';
export const swaggerConfig = new DocumentBuilder()
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
