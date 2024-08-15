import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IsEmail } from "class-validator";

export type PayerDocument = HydratedDocument<Payer>

export enum currency {
    EGP = 'EGP',
    USD = 'USD',
    AED = 'AED'
}

@Schema()
export class Payer {
    @Prop({ required: true })
    fullName: String;

    @Prop({ required: true, validate: [ IsEmail, 'Invalid Email' ] })
    email: String;

    @Prop({
        required: true,
        _id: false,
        type: {
            amount: {
                type: Number,
                validate: {
                    validator: (val: number) => val > 0,
                    message: 'Amount must be positive'
                }
            },
            currency: {
                type: String,
                enum: currency,
                required: true
            }
        }
    })
    dept: {
        amount: number;
        currency: string;
    };

    @Prop({ 
        type: { 
            userId: { type: Types.ObjectId },
            expireTokens: [String] 
        }, 
        _id: false 
    })
    users: { userId: Types.ObjectId, expireTokens: string[] };
    
    @Prop({ type: Types.ObjectId })
    merchantId: Types.ObjectId;
}

export const PayerSchema = SchemaFactory.createForClass(Payer);