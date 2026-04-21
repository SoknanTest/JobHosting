import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Job Platform API')
    .setDescription('Cambodia Job Hosting Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('users')
    .addTag('jobs')
    .addTag('applications')
    .addTag('chat')
    .addTag('notifications')
    .addTag('upload')
    .addTag('admin')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs at: http://localhost:${port}/api/docs`);
}
bootstrap();
