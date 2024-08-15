import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { PayersRepository } from './payers.repository';
import { CreatePayerDto } from './dtos/create-payer.dto';
import { RabbitMQService } from 'src/rabbitMQ/rabbitmq.service';

@Injectable()
export class PayersService implements OnModuleInit {
    constructor(
        private payersRepository: PayersRepository,
        private readonly rabbitmqService: RabbitMQService
    ) {}

    async onModuleInit() {
        await this.rabbitmqService.consume('payers-queue', (msg) => {
            const message = JSON.parse(msg.content.toString());
            const headers = msg.properties.headers;
            const functionName = headers.functionName;
            const args = message.args || [];

            if (typeof this[functionName] === 'function') {
                this[functionName].apply(this, args);
            } else {
                throw new BadRequestException(`Function ${functionName} is not defined in PayersService.`);
            }
        });
    } 

    async updateInvalidTokensArray(payerId: string, token: string, userId: string) {
        try {
            return await this.payersRepository.updateInvalidTokensArray(payerId, token, userId); 
        } catch (error) {
            return error;
        }
    }

    async getPayers(page: number, limit: number, search?: string) {
        return this.payersRepository.getPayersList(page, limit, search);
    }

    async getTotalDept(cif: string, fullName: string) {
        return await this.payersRepository.getTotalDept(cif, fullName); 
    }

    async createPayer(payer: CreatePayerDto) {
        const createdPayer =  await this.payersRepository.createPayer(payer);

        const userMessage = {
            args: [createdPayer._id, createdPayer.users.userId]
        };

        const usersHeaders = { functionName: 'addPayerIdToUser' };

        this.rabbitmqService.publish('users-queue', JSON.stringify(userMessage), usersHeaders);

        return createdPayer;
    }

    async getExpireTokens(id: string) {
        return await this.payersRepository.getInvalidTokensByUsersId(id);
    }

    async updateUserId(payerId: string, userId: string) {
        try {
            return await this.payersRepository.updateUserId(payerId, userId);
        } catch (error) {
            return error;
        }
    }

    async deletePayerByMerchantId(merchantId: string) {
        try {
            await this.payersRepository.deletePayerByMerchantId(merchantId);
        } catch (error) {
            return error;
        }
    }
}
