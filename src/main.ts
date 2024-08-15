import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { port } from './config';
import { AllExceptionFilter } from './all-exceptions.filter';
import { ResponseInterceptor } from './payers/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(port);
}
bootstrap();
