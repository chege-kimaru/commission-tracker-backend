import { Body, Controller, Delete, Get, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InvestorDto } from './dto/investor.dto';
import { ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InvestorService } from './investor.service';

@Controller('investors')
export class InvestorController {

    constructor(private investorService: InvestorService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add investor' })
    @ApiBody({ type: InvestorDto })
    @UseGuards(JwtAuthGuard)
    @Post()
    async addInvestor(@Req() req: any, @Body() investorDto: InvestorDto) {
        return this.investorService.addInvestor(investorDto, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get user investors' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getInvestors(@Req() req: any) {
        return this.investorService.getInvestors(req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get investor details' })
    @UseGuards(JwtAuthGuard)
    @Get(':investorId')
    async getInvestorDetails(@Req() req: any) {
        if(req.Investor.userId !== req.user.id) throw new UnauthorizedException();
        return this.investorService.getInvestorDetails(req.Investor.id, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update investor details' })
    @ApiBody({ type: InvestorDto })
    @UseGuards(JwtAuthGuard)
    @Put(':investorId')
    async updateInvestor(@Req() req: any, @Body() investorDto: InvestorDto) {
        if(req.Investor.userId !== req.user.id) throw new UnauthorizedException();
        return this.investorService.updateInvestor(req.Investor, investorDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete investor' })
    @UseGuards(JwtAuthGuard)
    @Delete(':investorId')
    async deleteInvestor(@Req() req: any) {
        if(req.Investor.userId !== req.user.id) throw new UnauthorizedException();
        return this.investorService.deleteInvestor(req.Investor);
    }
}
