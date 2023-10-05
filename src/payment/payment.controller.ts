import { Body, Controller, Delete, Get, Post, Put, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add payment' })
    @ApiBody({ type: CreatePaymentDto })
    @UseGuards(JwtAuthGuard)
    @Post()
    async addPayment(@Req() req: any, @Body() paymentDto: CreatePaymentDto) {
        return this.paymentService.addPayment(paymentDto, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get payments' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getPayments(@Req() req: any) {
        return this.paymentService.getPayments(req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get payment details' })
    @UseGuards(JwtAuthGuard)
    @Get(':paymentId')
    async getPaymentDetails(@Req() req: any) {
        if(req.Payment.userId !== req.user.id) throw new UnauthorizedException();
        return this.paymentService.getPaymentDetails(req.Payment.id, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update payment' })
    @ApiBody({ type: UpdatePaymentDto })   
    @UseGuards(JwtAuthGuard)
    @Put(':paymentId')
    async updatePayment(@Req() req: any, @Body() paymentDto: UpdatePaymentDto) {
        if(req.Payment.userId !== req.user.id) throw new UnauthorizedException();
        return this.paymentService.updatePayment(req.Payment, paymentDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete payment' })
    @UseGuards(JwtAuthGuard)
    @Delete(':paymentId')
    async deletePayment(@Req() req: any) {
        if(req.Payment.userId !== req.user.id) throw new UnauthorizedException();
        return this.paymentService.deletePayment(req.Payment);
    }
}
