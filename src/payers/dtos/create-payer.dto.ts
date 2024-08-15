import { IsArray, IsDefined, IsEmail, IsEnum, IsNumber, IsNumberString, IsOptional, IsPositive, IsString, ValidateNested } from "class-validator";
import { currency } from "../entities/payer.schema";
import { Type } from "class-transformer";

class DeptDto {
    @IsNumber({}, { message: 'amount must be number'})
    @IsPositive({ message: 'amount must be positive'})
    @IsDefined({ message: "amount is required"})
    amount: number;

    @IsEnum(currency, { message: `currenct must be one of ${Object.values(currency).join(', ')}`})
    @IsDefined({ message: "currency is required"})
    currency: string;
}

class UserDto {
    @IsString()
    userId: string;
    
    @IsArray()
    @IsOptional()
    expireTokens?: string[];
}

export class CreatePayerDto {
    @IsDefined({ message: "fullName is required"})
    @IsString({ message: 'fullname must be string' })
    fullName: string;

    @IsDefined({ message: "email is required"})
    @IsEmail({}, { message: 'email must be email'})
    email: string;

    @IsDefined({ message: "merchantId is required"})
    @IsString({ message: 'merchantId must be string' })
    merchantId: string;

    @IsOptional()
    @Type(() => UserDto)
    users?: UserDto;

    @ValidateNested()
    @Type(() => DeptDto)
    @IsDefined({ message: "dept is required"})
    dept: DeptDto
}