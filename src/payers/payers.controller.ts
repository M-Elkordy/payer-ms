import { Body, Controller, Get, Post, Query, Search, UseGuards } from '@nestjs/common';
import { PayersService } from './payers.service';
import { CreatePayerDto } from './dtos/create-payer.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('payers')
export class PayersController {
    constructor(private payersService: PayersService) {}
    
    @Get()
    @UseGuards(AuthGuard)
    getPayers(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search?: string) {
        return this.payersService.getPayers(page, limit, search);
    }
    
    @Get('/totaldept')
    @UseGuards(AuthGuard)
    async getTotalDept(@Query('cif') cif: string, @Query('fullName') fullName: string) {
        return this.payersService.getTotalDept(cif, fullName);
    }

    @Post()
    createPayer(@Body() body: CreatePayerDto) {
        return this.payersService.createPayer(body);
    }
}
