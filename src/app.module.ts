import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayersModule } from './payers/payers.module';
import { MongooseModule } from '@nestjs/mongoose';
import { connectionString } from './config';
import { MorganMiddleware } from './middlewares/morgan.middleware';

@Module({
  imports: [
    PayersModule,
    MongooseModule.forRoot(connectionString)
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
