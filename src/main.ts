import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { UtilsService } from './shared/utils.service';
import { CookieOptions } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // cors
  const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
      callback(null, true);
    },
  };
  app.enableCors(corsOptions);

  // cookie-parser
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // csurf
  app.use(
    csurf({
      cookie: true,
      // TODO: Change this
      ignoreMethods: [
        'GET',
        'HEAD',
        'OPTIONS',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
      ],
      // ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    }),
    (req, res, next) => {
      const cookieOptions: CookieOptions = {
        httpOnly: false,
        secure: false,
      };
      if (!UtilsService.isLocalhost(req)) {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'none';
        // cookieOptions.domain = process.env.DOMAIN;
      }
      res.cookie('XSRF-TOKEN', req.csrfToken(), cookieOptions);
      next();
    },
  );

  const options = new DocumentBuilder()
    .setTitle('Commission Tracker')
    .setDescription('Commission Tracker API Documentation')
    .setVersion('1.0')
    .addCookieAuth('_secure_id')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
