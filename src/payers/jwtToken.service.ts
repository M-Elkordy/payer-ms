import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtTokenService {
    constructor(private jwtService: JwtService) {}

    async extractJwtTokenData(token: string) {
        const tokenDecoded = await this.jwtService.decode(token);
        return tokenDecoded;
    }
}