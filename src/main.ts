import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, INestApplication } from '@nestjs/common';

import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';



const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:4200', // angular
      'http://localhost:3000', // react
      'http://localhost:8081', // react-native
    ],
  });

  setupSwagger(app);

  await app.listen(port);

  Logger.log(`Server is running on port : ${port}`,'Bootstrap')  

  
}
bootstrap();

 function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Idea')
    .setDescription('The Idea API')
    .setVersion('1.0')
    .addTag('Idea')
    .addBearerAuth("Authorization","header")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  

}