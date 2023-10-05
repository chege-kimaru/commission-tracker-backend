import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from '../payment.service';

@Injectable()
export class PaymentMiddleware implements NestMiddleware {
    constructor(private paymentService: PaymentService) {
    }

    async use(req: any, res: Response, next: Function) {
        try {
            const payment = await this.paymentService.getPaymentById(req.params.paymentId);
            if (payment?.id) {
                req.Payment = payment;
                next();
            } else {
                throw new NotFoundException('Payment not found');
            }
        } catch (e) {
            throw e;
        }
    }
}