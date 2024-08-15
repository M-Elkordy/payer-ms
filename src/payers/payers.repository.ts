import { InjectModel } from "@nestjs/mongoose";
import { Payer, PayerDocument } from "./entities/payer.schema";
import { Model } from "mongoose";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { CreatePayerDto } from "./dtos/create-payer.dto";


export class PayersRepository {
    constructor(@InjectModel(Payer.name) private payersModel: Model<Payer>) {}

    async getPayersList(page: number, limit: number, search?: string) {
        const payersCount = await this.payersModel.countDocuments();
        const skip = (page - 1) * limit;
        let query = {};
        // const projectQuery = {
        //     $project: { password: 0 }
        // }
        if(search) {
            query = {
                $or: [
                    { fullName: { $regex: search, $options: 'i' } }, 
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
        }
        if( skip >= payersCount && payersCount > 0 ) {
            throw new BadRequestException("no more payers in this page")
        }

        const data = await this.payersModel.find(query).sort().skip(skip).limit(limit);
        return data;
    }

    async getTotalDept(cif: string, fullName: string) {
        return await this.payersModel.aggregate([
            {
                $lookup: {
                    from: 'merchants',
                    localField: 'merchantId',
                    foreignField: '_id',
                    as: 'merchants'
                }
            },
            {
                $match: {
                    'merchants.cif': cif,
                    fullName: new RegExp(fullName, 'i')
                }
            },
            {
                $group: {
                    _id: "$dept.currency",
                    totalDept: { $sum: "$dept.amount" }
                }
            }
        ])
    }

    async createPayer(payer: CreatePayerDto): Promise<PayerDocument> {
        try {
            const payerCreated = await this.payersModel.create(payer);
            return payerCreated;
        } catch (error) {
            console.error('Error creating payer', error);
            return error;
        }
    }

    async getInvalidTokensByUsersId(id: string) {
        const payer = await this.payersModel.findOne({ merchantId: id });
        if(!payer)
            throw new UnauthorizedException();
        let invalidTokens = payer.users.expireTokens || [];
        return invalidTokens;
    }

    async updateInvalidTokensArray(payerId: string, token: string, userId: string) {
        await this.payersModel.updateOne(
            { _id: payerId, 'users.id': userId},
            { $push: { 'users.$.expireTokens': token } }
        ); 
    }

    async updateUserId(payerId: string, userId: string) {
        await this.payersModel.updateOne(
            { _id: payerId, 'users.id': userId },
            { $set: { 'users.$.id': null } }
        )
    }

    async deletePayerByMerchantId(merchantId: string){
        await this.payersModel.findOneAndDelete(
            { merchantId: merchantId }
        );
    }
}