import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  

  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });

  const config = new DocumentBuilder()
    .setTitle('Milcoach APIs')
    .setDescription('API documentation for Milcoach.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // Update bearerFormat to match your token type
      'jwt', // Name of the authorization scheme
    )
    .addTag('Milcoach')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await ConfigModule.envVariablesLoaded;

  const configService = app.get(ConfigService);

  const port = configService.get('app.port');

  Logger.log('Database connection established');

  Logger.log(`🚀 Server up and running at port ${port}`);

  await app.listen(port);
};

bootstrap();