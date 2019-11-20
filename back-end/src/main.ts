import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function initSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setBasePath('/api')
    .setTitle('Estate Api Document')
    .setDescription('The estate API description')
    .setVersion('1.0')
    .addTag('estate')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  initSwagger(app);
  await app.listen(port);
  Logger.log(`App is running at port ${port}`);
}
bootstrap();
