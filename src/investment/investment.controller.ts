import { Body, Controller, Delete, Get, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto, UpdateInvestmentDto } from './dto/investment.dto';
import { ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('investments')
export class InvestmentController {
    constructor(private investmentService: InvestmentService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add investment' })
    @ApiBody({ type: CreateInvestmentDto })
    @UseGuards(JwtAuthGuard)
    @Post()
    async addInvestment(@Req() req: any, @Body() investmentDto: CreateInvestmentDto) {
        return this.investmentService.addInvestment(investmentDto, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get investments' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getInvestments(@Req() req: any) {
        return this.investmentService.getInvestments(req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get investments\' stats' })
    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getInvestmentsStats(@Req() req: any) {
        return this.investmentService.getInvestmentsStats(req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get investment details' })
    @UseGuards(JwtAuthGuard)
    @Get(':investmentId')
    async getInvestmentDetails(@Req() req: any) {
        if(req.Investment.userId !== req.user.id) throw new UnauthorizedException();
        return this.investmentService.getInvestmentDetails(req.Investment.id, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update investment' })
    @ApiBody({ type: UpdateInvestmentDto })
    @UseGuards(JwtAuthGuard)
    @Put(':investmentId')
    async updateInvestment(@Req() req: any, @Body() investmentDto: UpdateInvestmentDto) {
        if(req.Investment.userId !== req.user.id) throw new UnauthorizedException();
        return this.investmentService.updateInvestment(req.Investment, investmentDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete investment' })
    @UseGuards(JwtAuthGuard)
    @Delete(':investmentId')
    async deleteInvestment(@Req() req: any) {
        if(req.Investment.userId !== req.user.id) throw new UnauthorizedException();
        return this.investmentService.deleteInvestment(req.Investment);
    }
}
