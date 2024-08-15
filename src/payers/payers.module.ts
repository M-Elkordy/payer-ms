import { Module } from '@nestjs/common';
import { PayersController } from './payers.controller';
import { PayersService } from './payers.service';
import { JwtTokenService } from './jwtToken.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Payer, PayerSchema } from './entities/payer.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth.constant';
import { PayersRepository } from './payers.repository';
import { RabbitMQModule } from 'src/rabbitMQ/rabbitmq.module';

@Module({
  controllers: [PayersController],
  providers: [
    PayersService,
    JwtTokenService, 
    PayersRepository
  ],
  imports: [
    MongooseModule.forFeature([{ name: Payer.name, schema: PayerSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' }
    }),
    RabbitMQModule
  ]
})
export class PayersModule {}
